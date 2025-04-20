# Build Image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Auth/Api/Api.csproj", "Auth/Api/"]
COPY ["Auth/Application/Application.csproj", "Auth/Application/"]
COPY ["Auth/Domain/Domain.csproj", "Auth/Domain/"]
COPY ["Auth/Infrastructure/Infrastructure.csproj", "Auth/Infrastructure/"]
COPY ["SharedKernel/SharedKernel.csproj", "SharedKernel/"]

RUN dotnet restore "Auth/Api/Api.csproj" -v d

COPY Auth/ .
COPY SharedKernel/ SharedKernel/

WORKDIR /src/Auth/Api
RUN dotnet publish -c Release -o /app/publish --no-restore

# Production image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Api.dll"]