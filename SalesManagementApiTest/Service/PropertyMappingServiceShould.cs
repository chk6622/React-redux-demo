using Routine.Api.Services;
using Routine.Api.Test;
using Xunit;
using Microsoft.Extensions.DependencyInjection;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;

namespace SalesManagementApiTest.Service
{
    
    public class PropertyMappingServiceShould:BaseTest
    {
        public PropertyMappingServiceShould(ProgramInitFixture programInitFixture) :base(programInitFixture)
        {

        }

        [Fact]
        [Trait("Category", "ToolClass")]
        public void CheckFields()
        {
            var propertyMappingService = Provider.GetService<IPropertyMappingService>();
            var result= propertyMappingService.GetPropertyMapping<CustomerDto,Customer>();
            Assert.NotEmpty(result);
        }
    }
}
