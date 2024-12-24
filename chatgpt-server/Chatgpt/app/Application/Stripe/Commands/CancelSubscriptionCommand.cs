using Domain.Common;
using Domain.User;
using Domain.User.Errors;
using Infrastructure.Data;
using Infrastructure.Stripe;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Stripe;
using XResults;
using Subscription = Stripe.Subscription;

namespace Application.Stripe.Commands;

public record CancelSubscriptionCommand(Guid UserId) : IRequest<SuccessOr<Error>>;

public class CancelSubscriptionCommandHandler
    : IRequestHandler<CancelSubscriptionCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly StripeSettings _stripeSettings;

    public CancelSubscriptionCommandHandler(
        ApplicationContext context,
        IOptions<StripeSettings> stripeSettings
    )
    {
        _context = context;
        _stripeSettings = stripeSettings.Value;
    }

    public async Task<SuccessOr<Error>> Handle(
        CancelSubscriptionCommand command,
        CancellationToken ct
    )
    {
        User? user = await _context
            .Users.Include(u => u.Subscription)
            .FirstOrDefaultAsync(u => u.Id == command.UserId, ct);

        if (user == null)
            return ErrorsUser.NotFound($"UserId: {command.UserId}");

        StripeConfiguration.ApiKey = _stripeSettings.ApiKey;

        SubscriptionService subscriptionService = new SubscriptionService();
        SubscriptionListOptions subscriptionListOptions = new SubscriptionListOptions
        {
            Customer = user.StripeCustomerId,
            Limit = 1 // Assuming one active subscription per customer
        };

        StripeList<Subscription>? subscriptions = await subscriptionService.ListAsync(
            subscriptionListOptions,
            cancellationToken: ct
        );

        if (!subscriptions.Any())
            return ErrorsStripe.SubscriptionNotFound($"For customerId: {user.StripeCustomerId}");

        Subscription? subscription = subscriptions.First();

        SuccessOr<Error> cancellationResult = user.CancelSubscription();
        if (cancellationResult.IsFailure)
            return cancellationResult.Error;

        await subscriptionService.CancelAsync(subscription.Id, cancellationToken: ct);
        await _context.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
