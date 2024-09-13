using System.Reflection.Metadata.Ecma335;

namespace Domain.DomainErrors;

public static partial class Errors
{
    public static class Chat
    {
        public static Error NotFound => new Error("chat.not.found");
    }
}