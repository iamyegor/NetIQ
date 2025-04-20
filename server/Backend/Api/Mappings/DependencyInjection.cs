using System.Reflection;
using Mapster;

namespace Api.Mappings;

public static class DependencyInjection
{
    public static IServiceCollection AddMapsterMappings(this IServiceCollection services)
    {
        TypeAdapterConfig.GlobalSettings.Scan(Assembly.GetExecutingAssembly());
        
        return services;
    }
}
