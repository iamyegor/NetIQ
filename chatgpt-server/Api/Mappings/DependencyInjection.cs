using System.Reflection;
using Mapster;

namespace Api.Mappings;

public static class DependencyInjection
{
    public static void AddMapsterMappings(this IServiceCollection services)
    {
        TypeAdapterConfig.GlobalSettings.Scan(Assembly.GetExecutingAssembly());
    }
}
