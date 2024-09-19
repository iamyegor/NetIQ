using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Infrastructure.Data.Dapper;
using Infrastructure.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SharedKernel.Auth;

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
        var apiKey = Environment.GetEnvironmentVariable("CustomGptApiKey")!;
        var proxyAddress = Environment.GetEnvironmentVariable("PROXY_ADDRESS")!;
        var proxyUsername = Environment.GetEnvironmentVariable("PROXY_USERNAME")!;
        var proxyPassword = Environment.GetEnvironmentVariable("PROXY_PASSWORD")!;

        var gptHttpClient = new GptHttpClient(
            apiKey: apiKey,
            proxyAddress: proxyAddress,
            proxyUsername: proxyUsername,
            proxyPassword: proxyPassword
        );

        services.AddSingleton(_ => gptHttpClient);
        services.AddScoped<ChatGpt>();
    }
}
