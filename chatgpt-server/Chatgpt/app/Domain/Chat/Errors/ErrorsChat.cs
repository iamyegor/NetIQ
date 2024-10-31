using Domain.Common;
using Domain.Errors;

namespace Domain.Chat.Errors;

public static class ErrorsChat
{
    public static Error NotFound => new("chat.not.found");
    public static Error ReachedMessageLimit => new("chat.reached.max.messages");
}
