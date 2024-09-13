namespace Domain.DomainErrors;

public static partial class Errors
{
    public static class Message
    {
        public static Error UserCannotSend2MessagesInARow =>
            new Error("user.cannot.send.2.messages.in.a.row");
    }
}
