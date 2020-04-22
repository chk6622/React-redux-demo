
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Onboarding_Task.AppDbContext;
using Onboarding_Task.Dao;
using Routine.Api.Services;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;
using Xunit.Abstractions;
using Xunit.Sdk;

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
                option => option.UseSqlServer("Data Source = localhost,1435;Initial Catalog = myDataBase;User Id = sa;Password = Xhy123456;")
            );

            Services.AddScoped<ICustomerDao, CustomerDao>();
            Services.AddTransient<IPropertyMappingService, PropertyMappingService>();
            Services.AddTransient<IPropertyCheckerService, PropertyCheckerService>();

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
