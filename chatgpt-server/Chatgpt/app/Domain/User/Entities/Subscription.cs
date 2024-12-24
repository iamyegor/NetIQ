using Domain.Common;

namespace Domain.User.Entities;

public class Subscription : Entity<int>
{
    public static readonly Subscription Plus = new Subscription(
        1,
        "plus",
        20,
        SubscriptionDuration.Month,
        99999999,
        "price_1QZZCzHXcNm6rEhrhlLXQCuE",
        "price_1QX4OCHXcNm6rEhrVFa1lJVm"
    );

    private Subscription(
        int id,
        string name,
        decimal price,
        SubscriptionDuration duration,
        int maxMessages,
        string priceIdDev,
        string priceIdProd
    )
        : base(id)
    {
        Name = name;
        Price = price;
        Duration = duration;
        MaxMessages = maxMessages;
        PriceIdDev = priceIdDev;
        PriceIdProd = priceIdProd;
    }

    protected Subscription()
        : base(0) { }

    public string Name { get; }
    public decimal Price { get; }
    public int MaxMessages { get; }
    public string PriceIdDev { get; }
    public string PriceIdProd { get; }
    public SubscriptionDuration Duration { get; }
}

public class SubscriptionDuration : ValueObject
{
    public static readonly SubscriptionDuration Month = new SubscriptionDuration("month");

    private SubscriptionDuration(string value)
    {
        Value = value;
    }

    public string Value { get; }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
