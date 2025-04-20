using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SharedKernel.Utils;
using Throw;

namespace Infrastructure.Data;

public class DbContextDesignTimeFactory : IDesignTimeDbContextFactory<ApplicationContext>
{
    public ApplicationContext CreateDbContext(string[] args)
    {
        string currentDir = Directory.GetCurrentDirectory();
        string configPath = Path.GetFullPath(Path.Combine(currentDir, "..", "Api"));

        ConfigurationBuilder configBuilder = new();
        string connectionString;
        if (AppEnv.IsDevelopment)
        {
            configBuilder.SetBasePath(configPath).AddJsonFile("appsettings.Development.json");
            IConfigurationRoot config = configBuilder.Build();
            connectionString = config.GetConnectionString("Default")!;
        }
        else
        {
            connectionString = Environment
                .GetEnvironmentVariable("CONNECTION_STRING")
                .ThrowIfNull();
        }

        return new ApplicationContext(connectionString);
    }
}
