using Api;
using Infrastructure.Data;
using Infrastructure.Data.Dapper;

WebApplication app = WebApplication.CreateBuilder(args).ConfigureServices().ConfigureMiddlewares();

await DatabaseAvailabilityChecker.WaitForDatabaseAsync(app.Services);

app.Run();
