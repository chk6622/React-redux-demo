using Routine.Api.Services;
using Routine.Api.Test;
using Xunit;
using Microsoft.Extensions.DependencyInjection;
using SalesManagementApi.Models;

namespace SalesManagementApiTest.Service
{
    
    public class PropertyCheckerServiceShould:BaseTest
    {
        public PropertyCheckerServiceShould(ProgramInitFixture programInitFixture) :base(programInitFixture)
        {

        }

        [Fact]
        [Trait("Category", "ToolClass")]
        public void CheckFields()
        {
            var propertyCheckerService = Provider.GetService<IPropertyCheckerService>();
            bool result=propertyCheckerService.TypeHasProperties<Customer>("Name");
            Assert.True(result);
            result = propertyCheckerService.TypeHasProperties<Customer>("name");
            Assert.True(result);
            result = propertyCheckerService.TypeHasProperties<Customer>("car");
            Assert.False(result);
            result = propertyCheckerService.TypeHasProperties<Customer>("Address");
            Assert.True(result);
            result = propertyCheckerService.TypeHasProperties<Customer>("aDdress");
            Assert.True(result);
            result = propertyCheckerService.TypeHasProperties<Customer>("nAMe,aDdress,Id");
            Assert.True(result);
            result = propertyCheckerService.TypeHasProperties<Customer>("nAMe,aDdress,Id,Ide");
            Assert.False(result);
        }
    }
}
