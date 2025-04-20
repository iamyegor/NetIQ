using Domain.Common;
using Domain.User.Entities;
using Domain.User.Errors;
using Domain.User.ValueObjects;
using Domain.User.ValueObjects.Email;
using XResults;

namespace Domain.User;

public class User : AggregateRoot<Guid>
{
    public Email Email { get; private set; }
    public IReadOnlyList<Chat.Chat> Chats => _chats.AsReadOnly();
    private readonly List<Chat.Chat> _chats = [];
    public int SentMessages { get; private set; }
    public Subscription? Subscription { get; private set; }
    public string? StripeCustomerId { get; private set; }

    public User()
        : base(Guid.NewGuid()) { }

    private User(Guid id)
        : base(id) { }

    public void AddChat(Chat.Chat chat) => _chats.Add(chat);

    public static User Create(Guid id, Email email) => new User(id) { Email = email };

    public void DeleteChat(Guid chatId)
    {
        Chat.Chat chat = _chats.Single(c => c.Id == chatId);
        _chats.Remove(chat);
    }

    public bool CanAccess(string modelName)
    {
        Model? model = Model.GetByName(modelName);
        return model != null && model.CanBeAccessedBy(Subscription);
    }

    public bool ReachedMaxMessages()
    {
        if (Subscription == null)
            return SentMessages >= 30;

        return SentMessages >= Subscription.MaxMessages;
    }

    public void IncrementSentMessages() => SentMessages++;

    public SuccessOr<Error> CancelSubscription()
    {
        if (Subscription == null)
            return Result.Fail(ErrorsUser.NotFound());

        Subscription = null;

        return Result.Ok();
    }

    public void UpdateSubscription(Subscription subscription)
    {
        Subscription = subscription;
    }

    public void UpdateCustomerId(string stripeCustomerId)
    {
        StripeCustomerId = stripeCustomerId;
    }
}
