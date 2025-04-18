using System.Reflection;
using Api.Utils;
using DotNetEnv;
using Infrastructure;
using SharedKernel.Communication.Extensions;
using SharedKernel.Utils;

namespace Api;

public static class Startup
{
    private const string CorsPolicy = "myCorsPolicy";

    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        if (AppEnv.IsDevelopment)
            Env.Load(".env.asp");

        builder.Host.AddSerilog();

        builder
            .Services.AddBaseServices(CorsPolicy)
            .AddInfrastructureServices(builder.Configuration, builder.Environment.IsDevelopment())
            .AddMassTransit(builder.Configuration, Assembly.GetExecutingAssembly());

        return builder.Build();
    }

    public static WebApplication ConfigureMiddlewares(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors(CorsPolicy);
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        return app;
    }
}
