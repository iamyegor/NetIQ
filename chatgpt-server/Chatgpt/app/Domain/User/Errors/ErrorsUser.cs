using Domain.Common;
using XResults;

namespace Domain.User.Errors;

public static class ErrorsUser
{
    public static Error NotFound(string? details = null) => new Error("user.not.found", details);

    public static Error HasNoModelAccess => new("user.has.no.model.access");
    public static Error ReachedMessageLimit => new("user.reached.message.limit");

    public static Error AlreadyHasSubscription(string? details = null) =>
        new Error("user.already.has.subscription", details);
}
