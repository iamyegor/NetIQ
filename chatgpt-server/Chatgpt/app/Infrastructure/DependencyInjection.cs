using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Infrastructure.Data.Dapper;
using Infrastructure.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SharedKernel.Auth;
using SharedKernel.Communication.Extensions;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration config,
        bool isDevelopment
    )
    {
        ConnectionStringResolver connectionStringResolver = new ConnectionStringResolver(config);
        string connectionString = connectionStringResolver.GetBasedOnEnvironment();

        services
            .AddScoped(_ => new ApplicationContext(connectionString, isDevelopment))
            .AddTransient<DapperConnectionFactory>()
            .AddTransient<HttpClient>()
            .AddTransient<ConnectionStringResolver>()
            .AddAuth(config)
            .AddChatgpt();

        return services;
    }

    public static void AddChatgpt(this IServiceCollection services)
    {
        services.AddSingleton(
            _ = new GptHttpClient(
                apiKey: Environment.GetEnvironmentVariable("CustomGptApiKey")!,
                proxyAddress: Environment.GetEnvironmentVariable("PROXY_ADDRESS")!,
                proxyUsername: Environment.GetEnvironmentVariable("PROXY_USERNAME")!,
                proxyPassword: Environment.GetEnvironmentVariable("PROXY_PASSWORD")!
            )
        );
        services.AddScoped<ChatGpt>();
    }
}
