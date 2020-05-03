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
    public class SalesDao : ISalesDao
    {
        private readonly MyDbContext _context = null;
        private readonly IPropertyCheckerService _propertyCheckerService = null;
        private readonly IPropertyMappingService _propertyMappingService = null;

        public SalesDao(MyDbContext myDbContext, IPropertyCheckerService propertyCheckerService, IPropertyMappingService propertyMappingService)
        {
            this._context = myDbContext;
            this._propertyCheckerService = propertyCheckerService;
            this._propertyMappingService = propertyMappingService;
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

        public void Delete(int id)
        {
             Sales sales=_context.Sales.Find(id);
             _context.Remove<Sales>(sales);
             _context.SaveChanges();

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

        public async Task<PagedList<Sales>> Query(SalesQryDto queryObject)
        {
            IQueryable<Sales> sales = this._context.Sales;
            if (queryObject != null)
            {
                if(queryObject.BeginDateSoldQry!=DateTime.MinValue)
                {
                    sales = sales.Where(s => s.DateSold >= queryObject.BeginDateSoldQry);
                }
                if (queryObject.EndDateSoldQry != DateTime.MinValue)
                {
                    sales = sales.Where(s => s.DateSold <= queryObject.EndDateSoldQry);
                }
               /* sales = sales.Where(s=>s.Customer.Id==(queryObject.CustomerId==0?s.Customer.Id : queryObject.CustomerId)
                                                && s.Product.Id==(queryObject.ProductId==0?s.Product.Id:queryObject.ProductId)
                                                && s.Store.Id==(queryObject.StoreId==0?s.Store.Id:queryObject.StoreId))
                                                */
                if(queryObject.CustomerId>0)
                {
                    sales = sales.Where(s => s.Customer.Id == queryObject.CustomerId);
                }
                if (queryObject.ProductId > 0)
                {
                    sales = sales.Where(s => s.Product.Id == queryObject.ProductId);
                }
                if (queryObject.StoreId > 0)
                {
                    sales = sales.Where(s => s.Store.Id == queryObject.StoreId);
                }
                sales =sales.Include(x => x.Customer)
                    .Include(x => x.Product)
                    .Include(x => x.Store);
            }
            else
            {
                sales = this._context.Sales;
            }
            var totalData = await sales.CountAsync();
            var mappingDictionary = this._propertyMappingService.GetPropertyMapping<SalesDto, Sales>();

            sales = sales.ApplySort(queryObject.OrderFields, mappingDictionary);

            var results = await sales.Skip(queryObject.Skip).Take(queryObject.PageSize).ToListAsync();
            PagedList<Sales> queryList = new PagedList<Sales>(results, totalData, queryObject.PageNumber, queryObject.PageSize);

            return queryList;
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
                //var updateSales = this._context.Sales.Attach(sales);
                //updateSales.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                await this._context.SaveChangesAsync();
                //this._context.Update(sales);
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
