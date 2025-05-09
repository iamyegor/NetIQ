using Api.Mappings;
using Serilog;
using Serilog.Debugging;
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
        services.RegisterMappings();

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
                        .WithOrigins(
                            "http://localhost",
                            "http://localhost:5173",
                            "https://netiq.ru",
                            "http://192.168.0.11"
                        )
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

        if (AppEnv.IsDevelopment)
            loggerConfig.WriteTo.Async(writeTo => writeTo.Console());
        else
            loggerConfig.WriteTo.Async(writeTo =>
                writeTo.File(
                    path: "/logs/log.txt",
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 30
                )
            );

        Log.Logger = loggerConfig.CreateLogger();

        SelfLog.Enable(Console.Out);
        host.UseSerilog();
    }
}
