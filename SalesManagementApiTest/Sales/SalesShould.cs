using SalesManagementApi.Dao;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Routine.Api.Test;
using SalesManagementApi.Models;
using System.Linq;
using System.Collections.Generic;
using Routine.Api.Helpers;
using AutoMapper;
using SalesManagementApi.Dto;
using System;
using SalesManagementApi.ViewModels;

namespace SalesManagementApiTest
{
    [TestCaseOrderer("SalesManagementApiTest.TestOrder", "SalesManagementApiTest")]
    public class SalesShould:BaseTest
    {
        public SalesShould(ProgramInitFixture programInitFixture) :base(programInitFixture)
        {
            
        }
        [Fact(DisplayName ="4.Test Sales")]
        [Trait("Category", "Dao")]
        public async void DoCurdOperation()
        {
            var salesDao = Provider.GetService<ISalesDao>();
            var customerDao = Provider.GetService<ICustomerDao>();
            var productDao = Provider.GetService<IProductDao>();
            var storeDao = Provider.GetService<IStoreDao>();
            var mapper = Provider.GetService<IMapper> ();

            #region Test add
            var customer1 = new Customer
            {
                Name="Tom",
                Address="City center"
            };
            var customer2 = new Customer
            {
                Name = "Kate",
                Address = "Mt Eden"
            };
            var product1 = new Product
            {
                Name = "Apple",
                Price = 5
            };
            var product2 = new Product
            {
                Name = "Banana",
                Price = 10
            };
            var store1 = new Store
            {
                Name = "Count down",
                Address = "Mt Albert"
            };
            var store2 = new Store
            {
                Name = "New world",
                Address = "St Lukes"
            };
            var sales1 = new Sales
            {
                DateSold = new DateTime(2008, 3, 1),
                Customer=customer1,
                Product=product1,
                Store=store1
            };
            var sales2 = new Sales
            {
                DateSold = new DateTime(2019, 6, 20),
                Customer = customer2,
                Product = product1,
                Store = store2
            };
            var sales3 = new Sales
            {
                DateSold = new DateTime(2020, 1, 30),
                Customer = customer1,
                Product = product2,
                Store = store2
            };

            bool result=await salesDao.Add(sales1);
            Assert.True(result);

            result = await salesDao.Add(sales2);
            Assert.True(result);

            result = await salesDao.Add(sales3);
            Assert.True(result);
            #endregion

            #region Test query
            var qry = new SalesQryDto
            {
                BeginDateSoldQry = new DateTime(2017, 1, 1),
                PageNumber=1,
                PageSize=10,
                OrderFields="DateSold desc"
            };
            PagedList<Sales> results=await salesDao.Query(qry);

            Assert.Equal(2, results.TotalCount);
            Assert.Equal(new DateTime(2020, 1, 30), results[0].DateSold);
            Assert.True(results[0].DateSold > results[1].DateSold);
            
            qry = new SalesQryDto
            {
                BeginDateSoldQry = new DateTime(2017, 1, 1),
                EndDateSoldQry=new DateTime(2020,1,1),
                PageNumber = 1,
                PageSize = 10,
                OrderFields = "DateSold desc"
            };
            results = await salesDao.Query(qry);
            Assert.Equal(1, results.TotalCount);
            Assert.Equal(new DateTime(2019, 6, 20), results[0].DateSold);

            
            qry = new SalesQryDto
            {
                CustomerId=customer1.Id,
                PageNumber = 1,
                PageSize = 10,
                OrderFields = "DateSold desc"
            };
            results = await salesDao.Query(qry);
            Assert.Equal(2, results.TotalCount);
            Assert.True(results[0].DateSold > results[1].DateSold);
            Assert.Equal("Tom",results[0].Customer.Name);
            Assert.Equal("Banana", results[0].Product.Name);
            Assert.Equal("New world", results[0].Store.Name);

            qry = new SalesQryDto
            {
                ProductId = product2.Id,
                PageNumber = 1,
                PageSize = 10,
                OrderFields = "DateSold desc"
            };
            results = await salesDao.Query(qry);
            Assert.Equal(1, results.TotalCount);
            Assert.Equal(new DateTime(2020, 1, 30), results[0].DateSold);
            Assert.Equal("Banana", results[0].Product.Name);
            Assert.Equal("Tom", results[0].Customer.Name);
            Assert.Equal("New world", results[0].Store.Name);
            #endregion

            #region Update
            sales1.Customer.Name = "Jack";
            sales1.DateSold = new DateTime(2019, 12, 30);
            result=await salesDao.Update(sales1);
            Assert.True(result);

            var sales=await salesDao.GetObjectById(sales1.Id);
            Assert.Equal(new DateTime(2019, 12, 30), sales.DateSold);
            Assert.Equal(sales1.Customer.Name, sales.Customer.Name);
            Assert.Equal(sales1.Product.Price, sales.Product.Price);
            Assert.Equal(sales1.Store.Address, sales.Store.Address);

            sales1.Product = null;
            sales = await salesDao.GetObjectById(sales1.Id);
            Assert.NotNull(sales);
            Assert.Null(sales.Product);

            #endregion

            #region Delete
            result =await salesDao.Delete(sales2.Id);
            Assert.True(result);
            sales=await salesDao.GetObjectById(sales2.Id);
            Assert.Null(sales);
            result = await salesDao.Delete(sales1.Id);
            Assert.True(result);
            result = await salesDao.Delete(sales3.Id);
            Assert.True(result);
            result = await customerDao.Delete(customer1.Id);
            Assert.True(result);
            result = await customerDao.Delete(customer2.Id);
            Assert.True(result);
            result = await productDao.Delete(product1.Id);
            Assert.True(result);
            result = await productDao.Delete(product2.Id);
            Assert.True(result);
            result = await storeDao.Delete(store1.Id);
            Assert.True(result);
            result = await storeDao.Delete(store2.Id);
            Assert.True(result);
            #endregion


        }

    }
}