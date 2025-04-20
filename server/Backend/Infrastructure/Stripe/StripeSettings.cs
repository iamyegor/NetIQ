namespace Infrastructure.Stripe;

public class StripeSettings
{
    public string ApiKey { get; set; } = null!;
    public string WebhookSecret { get; set; } = null!;
}
