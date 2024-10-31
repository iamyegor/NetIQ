namespace Infrastructure.EnvironmentUtils;

public class ApplicationEnvirontment
{
    public static bool IsDevelopment()
    {
        string environment = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")!;
        bool isDevelopment = environment == "Development";

        return isDevelopment;
    }
}