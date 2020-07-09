#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /app

# copy csproj and restore as distinct layers
#COPY SalesManagementSystemV2.sln .
COPY ./SalesManagementApi/*.csproj ./SalesManagementApi/
RUN dotnet restore "SalesManagementApi/SalesManagementApi.csproj"

# copy everything else and build app
COPY ./SalesManagementApi/. ./SalesManagementApi/
WORKDIR /app/SalesManagementApi
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS runtime
WORKDIR /app
COPY --from=build /app/SalesManagementApi/out ./
ENTRYPOINT ["dotnet", "SalesManagementApi.dll"]