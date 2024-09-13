using Domain.Common;

namespace Domain.User;

public class Chat : AggregateRoot<Guid>
{
    public string Title { get; }
    public IReadOnlyList<Message> Messages => _messages.AsReadOnly();
    private readonly List<Message> _messages = [];
    public DateTime LastUpdatedAt { get; private set; }

    public Chat(string title)
        : base(Guid.NewGuid())
    {
        Title = title;
    }

    public void AddMessage(Message message)
    {
        _messages.Add(message);

        LastUpdatedAt = DateTime.UtcNow;
    }

    public void AppendChatGptResponse(string content)
    {
        Message message = _messages.OrderBy(x => x.CreatedAt).Last();
        if (message.Sender != Sender.Assistant)
            throw new InvalidOperationException("Cannot append to user message");

        message.AppendContent(content);

        LastUpdatedAt = DateTime.UtcNow;
    }

    public Message RegenerateResponse(Guid linkId)
    {
        foreach (Message message in _messages.Where(m => m.LinkId == linkId))
        {
            message.IsSelected = false;
        }

        Message assistantMessage = new("", Sender.Assistant, linkId) { IsSelected = true };
        AddMessage(assistantMessage);

        return assistantMessage;
    }
}
