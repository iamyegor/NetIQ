using Domain.Common;
using Domain.User;
using Domain.User.Errors;
using Infrastructure.Data;
using Infrastructure.Stripe;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SharedKernel.Utils;
using Stripe;
using XResults;

namespace Application.Stripe.Commands;

public record UpdateSubscriptionCommand(Guid UserId, string NewPriceId)
    : IRequest<SuccessOr<Error>>;

public class UpdateSubscriptionCommandHandler
    : IRequestHandler<UpdateSubscriptionCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly StripeSettings _stripeSettings;

    public UpdateSubscriptionCommandHandler(
        ApplicationContext context,
        IOptions<StripeSettings> stripeSettings
    )
    {
        _context = context;
        _stripeSettings = stripeSettings.Value;
    }

    public async Task<SuccessOr<Error>> Handle(
        UpdateSubscriptionCommand command,
        CancellationToken ct
    )
    {
        User? user = await _context
            .Users.Include(u => u.Subscription)
            .FirstOrDefaultAsync(u => u.Id == command.UserId, ct);

        if (user == null)
            return ErrorsUser.NotFound($"UserId: {command.UserId}");

        if (user.StripeCustomerId == null)
            return ErrorsStripe.StripeCustomerIdIsNull($"For userId: {command.UserId}");

        SuccessOr<Error> stripeUpdateResult = await UpdateStripeSubscription(
            user.StripeCustomerId,
            command.NewPriceId,
            ct
        );
        if (stripeUpdateResult.IsFailure)
            return stripeUpdateResult;

        SuccessOr<Error> dbUpdateResult = await UpdateUserSubscriptionInDb(command, ct, user);
        if (dbUpdateResult.IsFailure)
            return dbUpdateResult.Error;

        return Result.Ok();
    }

    private async Task<SuccessOr<Error>> UpdateStripeSubscription(
        string customerId,
        string newPriceId,
        CancellationToken ct
    )
    {
        StripeConfiguration.ApiKey = _stripeSettings.ApiKey;

        SubscriptionService subscriptionService = new SubscriptionService();
        SubscriptionListOptions subscriptionListOptions = new SubscriptionListOptions
        {
            Customer = customerId,
            Limit = 1 // Assuming one active subscription per customer
        };

        StripeList<Subscription>? subscriptions = await subscriptionService.ListAsync(
            subscriptionListOptions,
            cancellationToken: ct
        );

        if (!subscriptions.Any())
            return ErrorsStripe.SubscriptionNotFound($"For customerId: {customerId}");

        Subscription? subscription = subscriptions.First();
        string? subscriptionItemId = subscription.Items.Data[0].Id;

        // Update the subscription with new price
        SubscriptionUpdateOptions options = new SubscriptionUpdateOptions
        {
            Items = [new SubscriptionItemOptions { Id = subscriptionItemId, Price = newPriceId }]
        };

        await subscriptionService.UpdateAsync(subscription.Id, options, cancellationToken: ct);

        return Result.Ok();
    }

    private async Task<SuccessOr<Error>> UpdateUserSubscriptionInDb(
        UpdateSubscriptionCommand command,
        CancellationToken ct,
        User user
    )
    {
        Domain.User.Entities.Subscription? subscription;
        if (AppEnv.IsDevelopment)
        {
            subscription = await _context.Subscriptions.FirstOrDefaultAsync(
                s => s.PriceIdDev == command.NewPriceId,
                ct
            );
        }
        else
        {
            subscription = await _context.Subscriptions.FirstOrDefaultAsync(
                s => s.PriceIdProd == command.NewPriceId,
                ct
            );
        }

        if (subscription is null)
            return ErrorsSubscription.NotFound($"PriceId: {command.NewPriceId}");

        user.UpdateSubscription(subscription);
        await _context.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
