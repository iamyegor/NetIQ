using Infrastructure.ChatGPT;
using Infrastructure.ChatGPT.ChatTitle;
using Infrastructure.Data;
using Infrastructure.Data.Dapper;
using Infrastructure.EnvironmentUtils;
using Infrastructure.Stripe;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SharedKernel.Auth;
using Throw;

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
            .AddScoped(_ => new ApplicationContext(connectionString))
            .AddTransient<DapperConnectionFactory>()
            .AddTransient<HttpClient>()
            .AddTransient<ConnectionStringResolver>()
            .AddAuth(config)
            .AddChatgpt(config);

        services.Configure<StripeSettings>(options =>
        {
            options.ApiKey = Environment.GetEnvironmentVariable("STRIPE_API_KEY").ThrowIfNull();
            options.WebhookSecret = Environment
                .GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET")
                .ThrowIfNull();
        });

        return services;
    }

    private static void AddChatgpt(this IServiceCollection services, IConfiguration config)
    {
        string apiKey = Environment.GetEnvironmentVariable("CHATGPT_API_KEY").ThrowIfNull();

        GptHttpClient gptHttpClient = new(apiKey);

        services.AddSingleton(_ => gptHttpClient);
        services.AddScoped<ChatGpt>();
        services.AddTransient<ChatTitleService>();
    }
}
