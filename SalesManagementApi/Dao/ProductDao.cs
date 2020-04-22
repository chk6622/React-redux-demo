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
    public class ProductDao : IProductDao
    {
        private readonly MyDbContext _context = null;

        public ProductDao(MyDbContext myDbContext)
        {
            this._context = myDbContext;
        }
        public async Task<bool> Add(Product product)
        {
            bool bReturn = false;
            try
            {
                await _context.AddAsync<Product>(product);
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
                Product product=await _context.Products.FindAsync(id);
                _context.Remove<Product>(product);
                await _context.SaveChangesAsync();
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public async Task<Product> GetObjectById(int id)
        {
            Product product = null;
            product = await _context.Products.FindAsync(id);
            return product;
        }

        public async Task<QueryResultView<Product>> Query(ProductView queryObject)
        {
            QueryResultView<Product> queryResults=new QueryResultView<Product>();
            IQueryable<Product> products = null;
            if (queryObject != null)
            {
                products=_context.Products.Where(p => p.Name.Contains(queryObject.NameQry)
                && p.Price == (queryObject.PriceQry == 0 ? p.Price : queryObject.PriceQry));
            }
            else
            {
                products = _context.Products;
            }
            queryResults.TotalData = await products.CountAsync();
            queryResults.Results = await products.OrderByDescending(product=>product.Id).Skip(queryObject.SkipData).Take(queryObject.DataPerPage).ToListAsync();
            return queryResults;
        }

        public async Task<IEnumerable<Product>> QueryAll()
        {
            return await this._context.Products.ToListAsync();
        }

        public async Task<bool> Update(Product product)
        {
            bool bReturn = false;
            try
            {
                var updateProduct = this._context.Products.Attach(product);
                updateProduct.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
