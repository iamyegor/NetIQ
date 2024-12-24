namespace Infrastructure.Stripe;

public class StripeSettings
{
    public string ApiKey { get; init; } = null!;
    public string WebhookSecret { get; init; } = null!;
}
