using Infrastructure.ChatGPT;
using Infrastructure.ChatGPT.ChatTitle;
using Infrastructure.Data;
using Infrastructure.Data.Dapper;
using Infrastructure.EnvironmentUtils;
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

    private static void AddChatgpt(this IServiceCollection services)
    {
        string apiKey = Environment.GetEnvironmentVariable("CustomGptApiKey")!;
        string proxyAddress = Environment.GetEnvironmentVariable("PROXY_ADDRESS")!;
        string proxyUsername = Environment.GetEnvironmentVariable("PROXY_USERNAME")!;
        string proxyPassword = Environment.GetEnvironmentVariable("PROXY_PASSWORD")!;

        GptHttpClient gptHttpClient = new GptHttpClient(
            apiKey,
            proxyAddress,
            proxyUsername,
            proxyPassword
        );

        services.AddSingleton(_ => gptHttpClient);
        services.AddScoped<ChatGpt>();
        services.AddTransient<ChatTitleService>();
    }
}
