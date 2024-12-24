using Domain.Common;

namespace Domain.User.Errors;

public static class ErrorsSubscription
{
    public static Error NotFound(string details)
    {
        return new Error("subscription.not.found", details);
    }
}
