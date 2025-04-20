using Api;
using Infrastructure.Data;

WebApplication app = WebApplication.CreateBuilder(args).ConfigureServices().ConfigureMiddlewares();

await DatabaseAvailabilityChecker.WaitForDatabaseAsync(app.Services);

app.Run();