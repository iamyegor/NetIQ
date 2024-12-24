using System.Reflection;
using Domain.User;
using Domain.User.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Serilog;

namespace Infrastructure.Data;

public class ApplicationContext : DbContext
{
    private readonly string _connectionString;
    private readonly bool _useLogger;
    public DbSet<User> Users => Set<User>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    public ApplicationContext() { }

    public ApplicationContext(string connectionString, bool useLogger)
    {
        _connectionString = connectionString;
        _useLogger = useLogger;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_connectionString);

        if (_useLogger)
        {
            optionsBuilder
                .UseLoggerFactory(LoggerFactory.Create(builder => builder.AddSerilog()))
                .EnableSensitiveDataLogging();
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
