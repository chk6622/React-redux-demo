using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Routine.Api.Helpers;
using Routine.Api.Services;
using SalesManagementApi.AppDbContext;
using SalesManagementApi.Dto;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;

namespace SalesManagementApi.Dao
{
    public class StoreDao : IStoreDao
    {
        private readonly MyDbContext _context = null;
        private readonly IPropertyCheckerService _propertyCheckerService = null;
        private readonly IPropertyMappingService _propertyMappingService = null;

        public StoreDao(MyDbContext myDbContext, IPropertyCheckerService propertyCheckerService, IPropertyMappingService propertyMappingService)
        {
            this._context = myDbContext;
            this._propertyCheckerService = propertyCheckerService;
            this._propertyMappingService = propertyMappingService;
        }
        public async Task<bool> Add(Store store)
        {
            bool bReturn = false;
            try
            {
                await _context.AddAsync<Store>(store);
                await _context.SaveChangesAsync();
                bReturn = true;
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public async Task<bool> Delete(int id)
        {
            bool bReturn = false;
            try
            {
                Store store=_context.Stores.Find(id);
                _context.Remove<Store>(store);
                await _context.SaveChangesAsync();
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public async Task<Store> GetObjectById(int id)
        {
            Store store = null;
            store = await _context.Stores.FindAsync(id);
            return store;
        }

        public async Task<PagedList<Store>> Query(StoreQryDto queryObject)
        {
            IQueryable<Store> stores = null;
            if (queryObject != null)
            {
                stores = this._context.Stores.Where(s => s.Name.Contains(queryObject.NameQry) && s.Address.Contains(queryObject.AddressQry));
            }
            else 
            {
                stores = this._context.Stores;
            }
            var totalData = await stores.CountAsync();

            var mappingDictionary = this._propertyMappingService.GetPropertyMapping<StoreDto, Store>();

            stores = stores.ApplySort(queryObject.OrderFields, mappingDictionary);

            var results = await stores.Skip(queryObject.Skip).Take(queryObject.PageSize).ToListAsync();
            PagedList<Store> queryList = new PagedList<Store>(results, totalData, queryObject.PageNumber, queryObject.PageSize);

            return queryList;
        }

        public async Task<IEnumerable<Store>> QueryAll()
        {
            return await this._context.Stores.ToListAsync();
        }

        public async Task<bool> Update(Store store)
        {
            bool bReturn = false;
            try
            {
                var updateStore = this._context.Stores.Attach(store);
                updateStore.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                await this._context.SaveChangesAsync();
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

    }
}
