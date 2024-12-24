using Infrastructure.ChatGPT;
using Infrastructure.ChatGPT.ChatTitle;
using Infrastructure.Data;
using Infrastructure.Data.Dapper;
using Infrastructure.EnvironmentUtils;
using Infrastructure.Stripe;
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
            .AddChatgpt(config);

        services.AddOptions<StripeSettings>().Bind(config.GetSection("Stripe"));

        return services;
    }

    private static void AddChatgpt(this IServiceCollection services, IConfiguration config)
    {
        string apiKey = config.GetValue<string>("ChatGpt:ApiKey")!;
        // string proxyAddress = Environment.GetEnvironmentVariable("PROXY_ADDRESS")!;
        // string proxyUsername = Environment.GetEnvironmentVariable("PROXY_USERNAME")!;
        // string proxyPassword = Environment.GetEnvironmentVariable("PROXY_PASSWORD")!;

        GptHttpClient gptHttpClient = new(apiKey);

        services.AddSingleton(_ => gptHttpClient);
        services.AddScoped<ChatGpt>();
        services.AddTransient<ChatTitleService>();
    }
}
