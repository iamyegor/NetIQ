using Domain.Common;
using Domain.Errors;
using Newtonsoft.Json;
using Serilog;

namespace Api.Utils;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _env;

    public ExceptionHandlingMiddleware(RequestDelegate next, IWebHostEnvironment env)
    {
        _next = next;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        string errorMessage = _env.IsProduction() ? "Internal server error" : exception.ToString();
        Log.Error(exception.ToString());

        Error error = Errors.Server.InternalServerError;
        string result = JsonConvert.SerializeObject(new { errorCode = error.Code, errorMessage });

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        return context.Response.WriteAsync(result);
    }
}
