# Build Image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

COPY ["Backend/Api/Api.csproj", "Backend/Api/"]
COPY ["Backend/Application/Application.csproj", "Backend/Application/"]
COPY ["Backend/Domain/Domain.csproj", "Backend/Domain/"]
COPY ["Backend/Infrastructure/Infrastructure.csproj", "Backend/Infrastructure/"]
COPY ["SharedKernel/SharedKernel.csproj", "SharedKernel/"]

RUN dotnet restore "Backend/Api/Api.csproj" -v d

COPY ["Backend/", "Backend/"]
COPY ["SharedKernel/", "SharedKernel/"]

RUN rm -rf Backend/Infrastructure/Data/CompiledModels

RUN dotnet ef dbcontext optimize \
    -o Backend/Infrastructure/Data/CompiledModels \
    --namespace Infrastructure.Data.CompiledModels \
    -c ApplicationContext \
    --project Backend/Infrastructure/Infrastructure.csproj

WORKDIR "/src/Backend/Api"
RUN dotnet publish -c Release -o /app/publish --no-restore

# Production image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Api.dll"]