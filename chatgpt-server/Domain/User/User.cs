using Domain.Common;

namespace Domain.User;

public class User : AggregateRoot<Guid>
{
    public IReadOnlyList<Chat> Chats => _chats.AsReadOnly();
    private readonly List<Chat> _chats = [];

    public User()
        : base(Guid.NewGuid()) { }

    public void AddChat(Chat chat)
    {
        _chats.Add(chat);
    }
}
