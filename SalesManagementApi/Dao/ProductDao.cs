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
    public class ProductDao : IProductDao
    {
        private readonly MyDbContext _context = null;
        private readonly IPropertyCheckerService _propertyCheckerService = null;
        private readonly IPropertyMappingService _propertyMappingService = null;

        public ProductDao(MyDbContext myDbContext, IPropertyCheckerService propertyCheckerService, IPropertyMappingService propertyMappingService)
        {
            this._context = myDbContext;
            this._propertyCheckerService = propertyCheckerService;
            this._propertyMappingService = propertyMappingService;
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

        public async Task<PagedList<Product>> Query(ProductQryDto queryObject)
        {
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
            var totalData = await products.CountAsync();

            var mappingDictionary = this._propertyMappingService.GetPropertyMapping<ProductDto, Product>();

            products = products.ApplySort(queryObject.OrderFields, mappingDictionary);

            var results = await products.Skip(queryObject.Skip).Take(queryObject.PageSize).ToListAsync();

            PagedList<Product> queryList = new PagedList<Product>(results, totalData,queryObject.PageNumber,queryObject.PageSize);
           
            return queryList;
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
