using Domain.Common;
using Domain.User.ValueObjects;

namespace Domain.User;

public class User : AggregateRoot<Guid>
{
    public Email Email { get; private set; }
    public IReadOnlyList<Chat.Chat> Chats => _chats.AsReadOnly();
    private readonly List<Chat.Chat> _chats = [];
    public SubscriptionStatus SubscriptionStatus { get; } = SubscriptionStatus.Free;
    public int SentMessages { get; set; }

    public User()
        : base(Guid.NewGuid()) { }

    private User(Guid id)
        : base(id) { }

    public void AddChat(Chat.Chat chat)
    {
        _chats.Add(chat);
    }

    public static User Create(Guid id, Email email)
    {
        return new User(id) { Email = email };
    }

    public void DeleteChat(Guid chatId)
    {
        Chat.Chat chat = _chats.Single(c => c.Id == chatId);
        _chats.Remove(chat);
    }

    public bool CanAccess(string modelName)
    {
        Model? model = Model.GetByName(modelName);
        return model != null && model.SubscriptionsWithAccess.Contains(SubscriptionStatus);
    }

    public bool ReachedMaxMessages()
    {
        return SentMessages >= SubscriptionStatus.MaxMessages;
    }
}
