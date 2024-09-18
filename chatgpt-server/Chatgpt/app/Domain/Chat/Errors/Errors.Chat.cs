using Domain.Errors;

namespace Domain.Chat.Errors;

public static partial class Errors
{
    public static class Chat
    {
        public static Error NotFound => new Error("chat.not.found");
    }
}