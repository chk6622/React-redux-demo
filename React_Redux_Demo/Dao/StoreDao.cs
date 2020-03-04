using System;
using System.Collections.Generic;
using System.Linq;
using Onboarding_Task.AppDbContext;
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Dao
{
    public class StoreDao : IStoreDao
    {
        private readonly MyDbContext _context = null;

        public StoreDao(MyDbContext myDbContext)
        {
            this._context = myDbContext;
        }
        public bool Add(Store store)
        {
            bool bReturn = false;
            try
            {
                _context.Add<Store>(store);
                _context.SaveChanges();
                bReturn = true;
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public bool Delete(int id)
        {
            bool bReturn = false;
            try
            {
                Store store=_context.Stores.Find(id);
                _context.Remove<Store>(store);
                _context.SaveChanges();
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public Store GetObjectById(int id)
        {
            Store store = null;
            store = _context.Stores.Find(id);
            return store;
        }

        public QueryResultView<Store> Query(StoreView queryObject)
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
            results.TotalData = stores.Count();
            results.Results = stores.OrderByDescending(store=>store.Id).Skip(queryObject.SkipData).Take(queryObject.DataPerPage).ToList();
            return results;
        }

        public IEnumerable<Store> QueryAll()
        {
            return this._context.Stores;
        }

        public bool Update(Store store)
        {
            bool bReturn = false;
            try
            {
                var updateStore = this._context.Stores.Attach(store);
                updateStore.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                this._context.SaveChanges();
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
