using Domain.Common;

namespace Domain.User;

public class Sender : ValueObject
{
    public static Sender User => new Sender("user");
    public static Sender Assistant => new Sender("assistant");
    public static Sender System => new Sender("system");
    public string Value { get; }

    protected Sender() { }

    private Sender(string value)
    {
        Value = value;
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}