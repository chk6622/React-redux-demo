using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.AppDbContext;
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Dao
{
    public class SalesDao : ISalesDao
    {
        private readonly MyDbContext _context = null;

        public SalesDao(MyDbContext myDbContext)
        {
            this._context = myDbContext;
        }
        public async Task<bool> Add(Sales sales)
        {
            bool bReturn = false;
            try
            {
                await _context.AddAsync<Sales>(sales);
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
                Sales sales=await _context.Sales.FindAsync(id);
                _context.Remove<Sales>(sales);
                await _context.SaveChangesAsync();
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public async Task<Sales> GetObjectById(int id)
        {
            Sales sales = null;
            try
            {
                sales = await _context.Sales.Include(x => x.Customer).Include(x=>x.Product).Include(x=>x.Store).FirstOrDefaultAsync(x => x.Id == id);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            
            return sales;
        }

        public async Task<QueryResultView<Sales>> Query(SalesView queryObject)
        {
            QueryResultView<Sales> results = new QueryResultView<Sales>();
            IQueryable<Sales> sales = null;
            if (queryObject != null)
            {
                sales = this._context.Sales.Where(s => s.DateSold.Contains(queryObject.DateSoldQry) 
                                                && s.Customer.Id==(queryObject.CustomerId==0?s.Customer.Id : queryObject.CustomerId)
                                                && s.Product.Id==(queryObject.ProductId==0?s.Product.Id:queryObject.ProductId)
                                                && s.Store.Id==(queryObject.StoreId==0?s.Store.Id:queryObject.StoreId)).Include(x => x.Customer).Include(x => x.Product).Include(x => x.Store);
            }
            else
            {
                sales = this._context.Sales;
            }
            results.TotalData = await sales.CountAsync();
            results.Results = await sales.OrderByDescending(sale=>sale.Id).Skip(queryObject.SkipData).Take(queryObject.DataPerPage).ToListAsync();
            return results;
        }

        public async Task<IEnumerable<Sales>> QueryAll()
        {
            return await this._context.Sales.Include(x => x.Customer).Include(x=>x.Product).Include(x=>x.Store).ToListAsync();
        }

        public async Task<bool> Update(Sales sales)
        {
            bool bReturn = false;
            try
            {
                var updateSales = this._context.Sales.Attach(sales);
                updateSales.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
