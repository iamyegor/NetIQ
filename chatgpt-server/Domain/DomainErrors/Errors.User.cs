namespace Domain.DomainErrors;

public static partial class Errors
{
    public class User
    {
        public static Error NotFound => new Error("user.not.found");
    }
}