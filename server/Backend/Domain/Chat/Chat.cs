using Domain.Chat.Entities;
using Domain.Chat.Entities.Message;
using Domain.Chat.Entities.Message.Errors;
using Domain.Common;
using XResults;

namespace Domain.Chat;

public class Chat : AggregateRoot<Guid>
{
    public Guid UserId { get; }
    public string Title { get; }
    public IReadOnlyList<Message> Messages => _messages.AsReadOnly();
    private readonly List<Message> _messages = [];
    public DateTime LastUpdatedAt { get; private set; }

    public Chat(string title)
        : base(Guid.NewGuid())
    {
        Title = title;
    }

    public void AddNewMessage(Message message)
    {
        _messages.Add(message);
        LastUpdatedAt = DateTime.UtcNow;

        foreach (Message msg in _messages.Where(m => m.LinkId == message.LinkId))
            msg.Unselect();

        message.Select();
    }

    public bool ReachedMaxMessages()
    {
        return _messages.Count(m => m.Sender == Sender.User) >= 50;
    }

    public SuccessOr<Error> SelectMessage(Guid messageId)
    {
        Message? messageToSelect = _messages.SingleOrDefault(x => x.Id == messageId);
        if (messageToSelect == null)
            return ErrorsMessage.DoesNotExist;

        foreach (Message message in _messages.Where(x => x.LinkId == messageToSelect.LinkId))
        {
            if (message.Id == messageToSelect.Id)
                message.Select();
            else
                message.Unselect();
        }

        return Result.Ok();
    }
}
