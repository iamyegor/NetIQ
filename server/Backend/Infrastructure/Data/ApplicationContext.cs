using System.Reflection;
using Domain.User;
using Domain.User.Entities;
using Infrastructure.Data.CompiledModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Serilog;
using SharedKernel.Utils;

namespace Infrastructure.Data;

public class ApplicationContext : DbContext
{
    private readonly string _connectionString;
    public DbSet<User> Users => Set<User>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    public ApplicationContext() { }

    public ApplicationContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_connectionString).UseModel(ApplicationContextModel.Instance);

        if (AppEnv.IsDevelopment)
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
