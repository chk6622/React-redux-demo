using Onboarding_Task.Dao;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Routine.Api.Test;
using Onboarding_Task.Models;
using Xunit.Abstractions;
using Onboarding_Task.ViewModels;
using System.Linq;
using System.Collections.Generic;
using Routine.Api.Services;

namespace SalesManagementApiTest
{
    public class CustomersShould:BaseTest
    {
        public CustomersShould(ProgramInitFixture programInitFixture) :base(programInitFixture)
        {
            
        }
        [Fact]
        [Trait("Category", "Dao")]
        public async void DoCurdOperation()
        {
            var customerDao = Provider.GetService<ICustomerDao>();

            #region test add
            var customer1 = new Customer
            {
                Name = "Tom",
                Address = "Mt Eden"
            };

            var customer2 = new Customer
            {
                Name = "Mary",
                Address = "Mt Albert"
            };

            var customer3 = new Customer
            {
                Name = "Kelly",
                Address = "City center"
            };

            bool result = await customerDao.Add(customer1);

            Assert.True(result);

            result = await customerDao.Add(customer2);

            Assert.True(result);

            result = await customerDao.Add(customer3);

            Assert.True(result);
            #endregion

            #region update
            customer2.Name = "Kate";

            result = await customerDao.Update(customer2);

            Assert.True(result);
            #endregion

            #region query
            IEnumerable<Customer> customers=await customerDao.QueryAll();

            Assert.NotNull(customers);
            Assert.Equal(3, customers.Count());
            var customerFirst = customers.First();
            var customerLast = customers.Last();
            Assert.IsType<Customer>(customerFirst);
            Assert.IsType<Customer>(customerLast);
            Assert.True(customerFirst.Id < customerLast.Id);


            var queryDto = new CustomerQryDto
            {
                NameQry = "K",
                OrderField="id desc"
            };

            QueryResultView<Customer> queryResult=await customerDao.Query(queryDto);

            Assert.NotNull(queryResult);
            Assert.Equal(2, queryResult.TotalData);
            var customerF = queryResult.Results[0];
            var customerS = queryResult.Results[1];
            Assert.True(customerS.Id < customerF.Id);
            Assert.Equal("Kate", customerS.Name);
            Assert.Equal("Mt Albert", customerS.Address);

            queryDto.PageSize = 1;
            queryDto.PageNumber = 2;
            queryDto.OrderField = "id";

            Assert.Equal(1, queryDto.Skip);

            queryResult = await customerDao.Query(queryDto);

            Assert.NotNull(queryResult);
            Assert.Equal(2, queryResult.TotalData);
            Assert.Equal(1, queryResult.Results.Count);
            var customer = queryResult.Results[0];
            Assert.Equal("Kelly", customer.Name);
            Assert.Equal("City center", customer.Address);

            #endregion

            #region delete
            result =await customerDao.Delete(customer1.Id);
            Assert.True(result);
            queryDto.NameQry = "To";
            queryResult = await customerDao.Query(queryDto);
            Assert.NotNull(queryResult);
            Assert.Equal(0, queryResult.TotalData);
            #endregion

        }

    }
}