using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesManagementApi.AppDbContext;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;

namespace SalesManagementApi.Dao
{
    public class StoreDao : IStoreDao
    {
        private readonly MyDbContext _context = null;

        public StoreDao(MyDbContext myDbContext)
        {
            this._context = myDbContext;
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

        public async Task<QueryResultView<Store>> Query(StoreView queryObject)
        {
            QueryResultView<Store> results = new QueryResultView<Store>();
            IQueryable<Store> stores = null;
            if (queryObject != null)
            {
                stores = this._context.Stores.Where(s => s.Name.Contains(queryObject.NameQry) && s.Address.Contains(queryObject.AddressQry));
            }
            else 
            {
                stores = this._context.Stores;
            }
            results.TotalData = await stores.CountAsync();
            results.Results = await stores.OrderByDescending(store=>store.Id).Skip(queryObject.SkipData).Take(queryObject.DataPerPage).ToListAsync();
            return results;
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
