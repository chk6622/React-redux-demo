using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.AppDbContext;
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;
using Routine.Api.Helpers;
using Routine.Api.Services;

namespace Onboarding_Task.Dao
{
    public class CustomerDao : ICustomerDao
    {
        private readonly MyDbContext _context = null;
        private readonly IPropertyCheckerService _propertyCheckerService = null;
        private readonly IPropertyMappingService _propertyMappingService = null;

        public CustomerDao(MyDbContext myDbContext, IPropertyCheckerService propertyCheckerService, IPropertyMappingService propertyMappingService)
        {
            this._context = myDbContext;
            this._propertyCheckerService = propertyCheckerService;
            this._propertyMappingService = propertyMappingService;
        }
        public async Task<bool> Add(Customer customer)
        {
            bool bReturn = false;
            try
            {
                await _context.AddAsync<Customer>(customer);
                await _context.SaveChangesAsync();//.SaveChanges();
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
                int count1=await _context.Customers.CountAsync<Customer>();
                Customer customer=await _context.Customers.FindAsync(id);
                _context.Remove<Customer>(customer);
                await _context.SaveChangesAsync();
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public async Task<Customer> GetObjectById(int id)
        {
            Customer customer = null;
            customer = await _context.Customers.FindAsync(id);
            return customer;
        }

        public async Task<PagedList<Customer>> Query(CustomerQryDto queryCustomer)
        {
            
            IQueryable<Customer> customers = null;
            
            if (queryCustomer != null)
            {
                customers = _context.Customers
                    .Where(c => c.Name.Contains(queryCustomer.NameQry) && c.Address.Contains(queryCustomer.AddressQry));
                
            }
            else
            {
                customers=_context.Customers;
            }
            var totalData = await customers.CountAsync();

            

            var mappingDictionary = this._propertyMappingService.GetPropertyMapping<CustomerDto, Customer>();

            customers = customers.ApplySort(queryCustomer.OrderFields, mappingDictionary);

            var results = await customers.Skip(queryCustomer.Skip).Take(queryCustomer.PageSize).ToListAsync();

            PagedList<Customer> queryList = new PagedList<Customer>(results, totalData, queryCustomer.PageNumber, queryCustomer.PageSize);


            return queryList;
        }

        public async Task<IEnumerable<Customer>> QueryAll()
        {
            return await this._context.Customers.ToListAsync();
        }

        public async Task<bool> Update(Customer customer)
        {
            bool bReturn = false;
            try
            {
                var updateCustomer = this._context.Customers.Attach(customer);
                updateCustomer.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
