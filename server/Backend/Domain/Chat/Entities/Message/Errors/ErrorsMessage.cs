using Domain.Common;
using XResults;

namespace Domain.Chat.Entities.Message.Errors;

public static class ErrorsMessage
{
    public static Error DoesNotExist => new("message.does.not.exist");
}
