using Domain.Common;
using Domain.User.Entities;

namespace Domain.User.ValueObjects;

public class Model : ValueObject
{
    private static Model Gpt4o = new Model("gpt-4o", [Subscription.Plus]);
    private static Model Gpt4oMini = new Model("gpt-4o-mini", true);

    public bool IsAccessibleToAll;
    public string Name { get; }
    public IReadOnlyList<Subscription> SubscriptionsWithAccess => _subscriptions.AsReadOnly();
    private readonly List<Subscription> _subscriptions = [];

    private Model(string name, List<Subscription> subscriptions)
    {
        Name = name;
        _subscriptions = subscriptions;
    }

    private Model(string name, bool isAccessibleToAll)
    {
        Name = name;
        IsAccessibleToAll = isAccessibleToAll;
    }

    public static Model? GetByName(string name)
    {
        return new List<Model> { Gpt4o, Gpt4oMini }.SingleOrDefault(x => x.Name == name);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Name;
    }

    public bool CanBeAccessedBy(Subscription? subscription)
    {
        if (IsAccessibleToAll)
            return true;

        return subscription != null && _subscriptions.Contains(subscription);
    }
}
