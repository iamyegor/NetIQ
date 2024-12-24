using Domain.Common;

namespace Domain.User.Errors;

public static class ErrorsStripe
{
    public static Error StripeEventHasNoPayload => new Error("stripe.event.has.no.payload");

    public static Error StripeEventDoesNotSpecifyCustomerId =>
        new Error("stripe.event.does.not.specify.customer.id");

    public static Error StripeEventDoesNotSpecifyPriceId =>
        new Error("stripe.event.does.not.specify.price.id");

    public static Error StripeSignatureIsEmpty => new Error("stripe.signature.is.empty");
    public static Error StripeEventHasNoBody => new Error("stripe.event.has.no.body");

    public static Error CantConstructStripeEvent(string? details)
    {
        return new Error("cant.construct.stripe.event", details);
    }

    public static Error SubscriptionNotFound(string? details)
    {
        return new Error("stripe.subscription.not.found", details);
    }

    public static Error StripeCustomerIdIsNull(string details)
    {
        return new Error("stripe.customer.id.is.null", details);
    }
}
