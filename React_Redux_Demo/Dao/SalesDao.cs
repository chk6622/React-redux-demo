using System;
using System.Collections.Generic;
using System.Linq;
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
        public bool Add(Sales sales)
        {
            bool bReturn = false;
            try
            {
                _context.Add<Sales>(sales);
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
                Sales sales=_context.Sales.Find(id);
                _context.Remove<Sales>(sales);
                _context.SaveChanges();
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public Sales GetObjectById(int id)
        {
            Sales sales = null;
            try
            {
                sales = _context.Sales.Include(x => x.Customer).Include(x=>x.Product).Include(x=>x.Store).FirstOrDefault(x => x.Id == id);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            
            return sales;
        }

        public QueryResultView<Sales> Query(SalesView queryObject)
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
            results.TotalData = sales.Count();
            results.Results = sales.OrderByDescending(sale=>sale.Id).Skip(queryObject.SkipData).Take(queryObject.DataPerPage).ToList();
            return results;
        }

        public IEnumerable<Sales> QueryAll()
        {
            return this._context.Sales.Include(x => x.Customer).Include(x=>x.Product).Include(x=>x.Store);
        }

        public bool Update(Sales sales)
        {
            bool bReturn = false;
            try
            {
                var updateSales = this._context.Sales.Attach(sales);
                updateSales.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
