using Domain.Common;

namespace Domain.User.ValueObjects;

public class SubscriptionStatus : ValueObject
{
    public static SubscriptionStatus Free { get; } = new SubscriptionStatus("free");
    public static SubscriptionStatus Plus { get; } = new SubscriptionStatus("plus");

    public string Value { get; }

    private SubscriptionStatus(string value)
    {
        Value = value;
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
