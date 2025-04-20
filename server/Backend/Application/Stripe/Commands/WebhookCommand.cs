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
using Stripe.Checkout;
using XResults;
using Subscription = Domain.User.Entities.Subscription;

namespace Application.Stripe.Commands;

public record WebhookCommand(string Body, string? StripeSignature) : IRequest<SuccessOr<Error>>;

public class WebhookCommandHandler : IRequestHandler<WebhookCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly StripeSettings _stripeSettings;

    public WebhookCommandHandler(
        IOptions<StripeSettings> stripeSettings,
        ApplicationContext context
    )
    {
        _stripeSettings = stripeSettings.Value;
        _context = context;
    }

    public async Task<SuccessOr<Error>> Handle(WebhookCommand command, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(command.Body))
            return ErrorsStripe.StripeEventHasNoBody;

        if (string.IsNullOrEmpty(command.StripeSignature))
            return ErrorsStripe.StripeSignatureIsEmpty;

        Event? stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                command.Body,
                command.StripeSignature,
                _stripeSettings.WebhookSecret
            );
        }
        catch (StripeException e)
        {
            return ErrorsStripe.CantConstructStripeEvent(e.Message);
        }

        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
        {
            StripeConfiguration.ApiKey = _stripeSettings.ApiKey;

            SessionService sessionService = new SessionService();
            SessionGetOptions getOptions = new SessionGetOptions { Expand = ["line_items"] };

            Session session = await sessionService.GetAsync(
                (stripeEvent.Data.Object as Session)!.Id,
                getOptions,
                cancellationToken: ct
            );

            if (session is null)
                return ErrorsStripe.StripeEventHasNoPayload;

            if (string.IsNullOrEmpty(session.ClientReferenceId))
                return ErrorsStripe.StripeEventDoesNotSpecifyCustomerId;

            Guid userId = Guid.Parse(session.ClientReferenceId);

            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
            if (user is null)
                return ErrorsUser.NotFound($"UserId: {userId}");

            string? purchasedPriceId = session.LineItems.Data[0].Price.Id;

            if (string.IsNullOrEmpty(purchasedPriceId))
                return ErrorsStripe.StripeEventDoesNotSpecifyPriceId;

            Subscription? subscription;
            if (AppEnv.IsDevelopment)
            {
                subscription = await _context.Subscriptions.FirstOrDefaultAsync(
                    s => s.PriceIdDev == purchasedPriceId,
                    ct
                );
            }
            else
            {
                subscription = await _context.Subscriptions.FirstOrDefaultAsync(
                    s => s.PriceIdProd == purchasedPriceId,
                    ct
                );
            }

            if (subscription is null)
                return ErrorsSubscription.NotFound($"PriceId: {purchasedPriceId}");

            user.UpdateCustomerId(session.CustomerId);
            user.UpdateSubscription(subscription);

            await _context.SaveChangesAsync(ct);
        }
        else if (stripeEvent.Type == EventTypes.CustomerSubscriptionDeleted)
        {
            global::Stripe.Subscription? stripeSubscription =
                stripeEvent.Data.Object as global::Stripe.Subscription;
            if (stripeSubscription is null)
                return ErrorsStripe.StripeEventHasNoPayload;

            Guid userId = Guid.Empty;

            User? user = await _context
                .Users.Include(user => user.Subscription)
                .FirstOrDefaultAsync(u => u.Id == userId, ct);

            if (user is null)
                return ErrorsUser.NotFound($"UserId: {userId}");

            user.CancelSubscription();

            await _context.SaveChangesAsync(ct);
        }

        return Result.Ok();
    }
}
