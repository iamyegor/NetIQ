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

namespace Application.Stripe.Commands;

public record CreateCheckoutSessionCommand(Guid UserId, string PriceId)
    : IRequest<Result<string, Error>>;

public class CreateCheckoutSessionCommandHandler
    : IRequestHandler<CreateCheckoutSessionCommand, Result<string, Error>>
{
    private readonly ApplicationContext _context;
    private readonly StripeSettings _stripeSettings;

    public CreateCheckoutSessionCommandHandler(
        ApplicationContext context,
        IOptions<StripeSettings> stripeSettings
    )
    {
        _context = context;
        _stripeSettings = stripeSettings.Value;
    }

    public async Task<Result<string, Error>> Handle(
        CreateCheckoutSessionCommand command,
        CancellationToken ct
    )
    {
        User? user = await _context
            .Users.Where(x => x.Id == command.UserId)
            .Include(u => u.Subscription)
            .FirstOrDefaultAsync(ct);

        if (user == null)
            return ErrorsUser.NotFound($"UserId: {command.UserId}");

        if (user.Subscription != null)
            return ErrorsUser.AlreadyHasSubscription($"UserId: {command.UserId}");

        StripeConfiguration.ApiKey = _stripeSettings.ApiKey;

        PriceService priceService = new PriceService();
        Price? price = await priceService.GetAsync(command.PriceId, cancellationToken: ct);

        string mode = price.Type == "recurring" ? "subscription" : "payment";

        SessionService stripeSessionService = new SessionService();

        string siteUrl = Environment.GetEnvironmentVariable("SITE_URL")!;
        string origin = AppEnv.IsProduction ? siteUrl : "http://localhost";

        Session? stripeCheckoutSession = await stripeSessionService.CreateAsync(
            new SessionCreateOptions
            {
                Mode = mode,
                ClientReferenceId = command.UserId.ToString(),
                CustomerEmail = user.Email.Value,
                LineItems = [new SessionLineItemOptions { Price = command.PriceId, Quantity = 1 }],
                SuccessUrl = origin,
                CancelUrl = origin
            },
            cancellationToken: ct
        );

        return stripeCheckoutSession.Url;
    }
}
