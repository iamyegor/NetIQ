namespace Domain.Common;

public abstract class ValueObject
{
    protected abstract IEnumerable<object?> GetEqualityComponents();

    public override bool Equals(object? obj)
    {
        if (obj is not ValueObject valueObject)
        {
            return false;
        }
        else if (GetRealType() != valueObject.GetRealType())
        {
            return false;
        }

        return GetEqualityComponents().SequenceEqual(valueObject.GetEqualityComponents());
    }

    public override int GetHashCode()
    {
        return GetEqualityComponents()
            .Aggregate(
                1,
                (acc, obj) =>
                {
                    unchecked
                    {
                        return acc * obj?.GetHashCode() ?? 0;
                    }
                }
            );
    }

    private Type GetRealType()
    {
        Type type = GetType();
        if (type.ToString().Contains("Castle.Proxies"))
        {
            return type.BaseType!;
        }

        return type;
    }

    public static bool operator ==(ValueObject? a, ValueObject? b)
    {
        return Equals(a, b);
    }

    public static bool operator !=(ValueObject? a, ValueObject? b)
    {
        return !(a == b);
    }
}
