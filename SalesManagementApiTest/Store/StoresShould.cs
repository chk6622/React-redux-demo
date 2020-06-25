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
    public class StoresShould:BaseTest
    {
        public StoresShould(ProgramInitFixture programInitFixture) :base(programInitFixture)
        {

        }

        [Fact(DisplayName ="2.Test Store")]
        [Trait("Category", "Dao")]
        public async void DoCurdOperation()
        {
            var storeDao = Provider.GetService<IStoreDao>();
            var mapper = Provider.GetService<IMapper>();

            #region test add
            var store1 = new Store
            {
                Name = "Count down",
                Address = "Mt Eden"
            };

            var store2 = new Store
            {
                Name = "New world",
                Address = "Mt Albert"
            };

            var store3 = new Store
            {
                Name = "Parking save",
                Address = "City center"
            };

            bool result = await storeDao.Add(store1);

            Assert.True(result);

            result = await storeDao.Add(store2);

            Assert.True(result);

            result = await storeDao.Add(store3);

            Assert.True(result);
            #endregion

            #region update
            store2.Name = "Count down";

            result = await storeDao.Update(store2);

            Assert.True(result);
            #endregion

            #region query
            IEnumerable<Store> stores = await storeDao.QueryAll();

            Assert.NotNull(stores);
            Assert.Equal(3, stores.Count());
            var storeFirst = stores.First();
            var storeLast = stores.Last();
            Assert.IsType<Store>(storeFirst);
            Assert.IsType<Store>(storeLast);
            Assert.True(storeFirst.Id < storeLast.Id);


            var queryDto = new StoreQryDto
            {
                NameQry = "down",
                OrderFields = "id desc",
                ShapeFields = "Id"
            };

            PagedList<Store> queryResult = await storeDao.Query(queryDto);

            Assert.NotNull(queryResult);
            Assert.Equal(2, queryResult.TotalCount);
            var storeF = queryResult[0];
            var storeS = queryResult[1];
            Assert.True(storeS.Id < storeF.Id);
            Assert.Equal("Count down", storeS.Name);
            Assert.Equal("Mt Eden", storeS.Address);

            queryDto.PageSize = 1;
            queryDto.PageNumber = 2;
            queryDto.OrderFields = "id";

            Assert.Equal(1, queryDto.Skip);

            queryResult = await storeDao.Query(queryDto);

            Assert.NotNull(queryResult);
            Assert.Equal(2, queryResult.TotalCount);
            Assert.Equal(1, queryResult.Count);
            var store = queryResult[0];
            Assert.Equal("Count down", store.Name);
            Assert.Equal("Mt Albert", store.Address);

            #endregion

            #region Shaped

            var storeDtos = mapper.Map<IEnumerable<StoreDto>>(queryResult);
            var shapedData = storeDtos.ShapData<StoreDto>(queryDto.ShapeFields);
            foreach (var obj in shapedData)
            {
                var storeDict = obj as IDictionary<string, object>;
                Assert.NotNull(storeDict);
                Assert.True(storeDict.ContainsKey("Id"));
                Assert.False(storeDict.ContainsKey("Name"));
                Assert.False(storeDict.ContainsKey("Address"));
            }
            #endregion
            /*
            #region delete
            result = await storeDao.Delete(store1.Id);
            Assert.True(result);
            queryDto.NameQry = "Eden";
            queryResult = await storeDao.Query(queryDto);
            Assert.NotNull(queryResult);
            Assert.Equal(0, queryResult.TotalCount);
            result = await storeDao.Delete(store2.Id);
            Assert.True(result);
            result = await storeDao.Delete(store3.Id);
            Assert.True(result);
            #endregion
    */
        }
    }
}
