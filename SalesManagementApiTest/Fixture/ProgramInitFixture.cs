
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SalesManagementApi.AppDbContext;
using SalesManagementApi.Dao;
using Routine.Api.Services;
using System;
using Xunit;

namespace Routine.Api.Test
{
    public class ProgramInitFixture:IDisposable
    {
        public IServiceCollection Services { get; }
        public IServiceProvider Provider { get; }

        //public ITestOutputHelper Output { get; } = new TestOutputHelper();

        public ProgramInitFixture()
        {
            Console.WriteLine("Build all kinds of services!");
            Services = new ServiceCollection();
            
            Services.AddDbContext<MyDbContext>(
                option => option.UseSqlServer("Data Source = localhost,1435;Initial Catalog = myDataBaseTest;User Id = sa;Password = Xhy123456;")
            );

            Services.AddScoped<ICustomerDao, CustomerDao>();
            Services.AddScoped<IProductDao, ProductDao>();
            Services.AddScoped<IStoreDao, StoreDao>();
            Services.AddScoped<ISalesDao, SalesDao>();
            Services.AddTransient<IPropertyMappingService, PropertyMappingService>();
            Services.AddTransient<IPropertyCheckerService, PropertyCheckerService>();

            Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());  //注册automapper，用于对象属性映射。

            Provider = Services.BuildServiceProvider();
            Console.WriteLine("All services have been built!");


            this.Init();
            
        }

       

        private void Init()
        {
            Console.WriteLine("Init the database!");
            var dbContext = Provider.GetService<MyDbContext>();
            dbContext.Database.EnsureDeleted();
            dbContext.Database.Migrate();
            dbContext.Sales.RemoveRange(dbContext.Sales);
            dbContext.Customers.RemoveRange(dbContext.Customers);
            dbContext.Stores.RemoveRange(dbContext.Stores);
            dbContext.Products.RemoveRange(dbContext.Products);

            dbContext.SaveChanges();
            Console.WriteLine("The database has initilized!");
        }

        public void Dispose()
        {
            Console.WriteLine("Clean all services and the database!");
            var dbContext = Provider.GetService<MyDbContext>();
            dbContext.Database.EnsureDeleted();

            Services.Clear();
            Console.WriteLine("All services and the database have been cleaned!");
        }
    }

    [CollectionDefinition("ProgramInitCollection")]
    public class ProgramInitCollection:ICollectionFixture<ProgramInitFixture>
    {

    }
}
