# Build Image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Chatgpt/app/Api/Api.csproj", "Api/"]
COPY ["Chatgpt/app/Application/Application.csproj", "Application/"]
COPY ["Chatgpt/app/Domain/Domain.csproj", "Domain/"]
COPY ["Chatgpt/app/Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["SharedKernel/SharedKernel.csproj", "SharedKernel/"]
RUN dotnet restore Api/Api.csproj -v d

COPY Chatgpt/app/ .
COPY SharedKernel/ SharedKernel/

WORKDIR /src/Api
RUN dotnet publish -c Release -o /app/publish

# Production image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Api.dll"]