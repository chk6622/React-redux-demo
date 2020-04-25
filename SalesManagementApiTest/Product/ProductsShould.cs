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

namespace SalesManagementApiTest
{
    [TestCaseOrderer("SalesManagementApiTest.TestOrder", "SalesManagementApiTest")]
    public class ProductsShould:BaseTest
    {
        public ProductsShould(ProgramInitFixture programInitFixture) :base(programInitFixture)
        {
            
        }
        [Fact(DisplayName ="3.Test Product")]
        [Trait("Category", "Dao")]
        public async void DoCurdOperation()
        {
            var productDao = Provider.GetService<IProductDao>();
            var mapper = Provider.GetService<IMapper> ();

            #region test add
            var product1 = new Product
            {
                Name = "Pen",
                Price = 1
            };

            var product2 = new Product
            {
                Name = "Paper",
                Price = 1
            };

            var product3 = new Product
            {
                Name = "Box",
                Price = 5
            };

            bool result = await productDao.Add(product1);

            Assert.True(result);

            result = await productDao.Add(product2);

            Assert.True(result);

            result = await productDao.Add(product3);

            Assert.True(result);
            #endregion

            #region update
            product2.Name = "Calculater";

            result = await productDao.Update(product2);

            Assert.True(result);
            #endregion

            #region query
            IEnumerable<Product> products=await productDao.QueryAll();

            Assert.NotNull(products);
            Assert.Equal(3, products.Count());
            var productFirst = products.First();
            var productLast = products.Last();
            Assert.IsType<Product>(productFirst);
            Assert.IsType<Product>(productLast);
            Assert.True(productFirst.Id < productLast.Id);


            var queryDto = new ProductQryDto
            {
                PriceQry = 1,
                OrderFields="id desc",
                ShapeFields="Id"
            };

            PagedList<Product> queryResult=await productDao.Query(queryDto);

            Assert.NotNull(queryResult);
            Assert.Equal(2, queryResult.TotalCount);
            var productF = queryResult[0];
            var productS = queryResult[1];
            Assert.True(productS.Id < productF.Id);
            Assert.Equal("Calculater", productF.Name);
            Assert.Equal(1, productF.Price);

            queryDto.PageSize = 10;
            queryDto.PageNumber = 1;
            queryDto.OrderFields = "price,name desc";

            Assert.Equal(0, queryDto.Skip);

            queryResult = await productDao.Query(queryDto);

            Assert.NotNull(queryResult);
            Assert.Equal(2, queryResult.TotalCount);
            Assert.Equal(2, queryResult.Count);
            var product = queryResult[0];
            Assert.Equal("Pen", product.Name);
            Assert.Equal(1, product.Price);

            #endregion

            #region Shaped

            var productDtos = mapper.Map<IEnumerable<ProductDto>>(queryResult);
            var shapedData = productDtos.ShapData<ProductDto>(queryDto.ShapeFields);
            foreach(var obj in shapedData)
            {
                var productDict = obj as IDictionary<string, object>;
                Assert.NotNull(productDict);
                Assert.True(productDict.ContainsKey("Id"));
                Assert.False(productDict.ContainsKey("Name"));
                Assert.False(productDict.ContainsKey("Price"));
            }
            #endregion

            #region delete
            result = await productDao.Delete(product1.Id);
            Assert.True(result);
            queryDto.NameQry = "Pen";
            queryResult = await productDao.Query(queryDto);
            Assert.NotNull(queryResult);
            Assert.Equal(0, queryResult.TotalCount);
            result = await productDao.Delete(product2.Id);
            Assert.True(result);
            result = await productDao.Delete(product3.Id);
            Assert.True(result);
            #endregion

        }

    }
}