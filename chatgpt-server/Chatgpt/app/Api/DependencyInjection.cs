using Api.Mappings;
using Application;
using Serilog;
using Serilog.Events;
using SharedKernel.Utils;

namespace Api;

public static class DependencyInjection
{
    public static IServiceCollection AddBaseServices(
        this IServiceCollection services,
        string corsPolicy
    )
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddCors(corsPolicy);
        services.AddMapsterMappings();
        services.AddApplication();

        return services;
    }

    private static void AddCors(this IServiceCollection services, string corsPolicy)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(
                corsPolicy,
                policy =>
                {
                    policy
                        .WithOrigins("http://localhost", "https://netiq.ru", "http://192.168.0.11")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                }
            );
        });
    }

    public static void AddSerilog(this ConfigureHostBuilder host)
    {
        LoggerConfiguration loggerConfig = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .Enrich.FromLogContext();

        if (AppEnv.IsProduction)
        {
            loggerConfig.WriteTo.Async(writeTo =>
                writeTo.File(
                    "/logs/log-.txt",
                    rollingInterval: RollingInterval.Day,
                    rollOnFileSizeLimit: true
                )
            );
        }
        else
        {
            loggerConfig.WriteTo.Async(writeTo => writeTo.Console());
        }

        Log.Logger = loggerConfig.CreateLogger();

        // SelfLog.Enable(Console.Out);
        host.UseSerilog();
    }
}
