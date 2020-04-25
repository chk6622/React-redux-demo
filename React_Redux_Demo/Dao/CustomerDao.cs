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
    public class CustomerDao : ICustomerDao
    {
        private readonly MyDbContext _context = null;

        public CustomerDao(MyDbContext myDbContext)
        {
            this._context = myDbContext;
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

        public async Task<QueryResultView<Customer>> Query(CustomerView queryCustomer)
        {
            QueryResultView<Customer> queryResult = new QueryResultView<Customer>();
            IQueryable<Customer> customers = null;
            //_context.ChangeTracker.DetectChanges();
            if (queryCustomer != null)
            {
                customers = _context.Customers
                    .Where(c => c.Name.Contains(queryCustomer.NameQry) && c.Address.Contains(queryCustomer.AddressQry));
                
            }
            else
            {
                customers=_context.Customers;
            }
            queryResult.TotalData = await customers.CountAsync();
            queryResult.Results = await customers.OrderByDescending(customer => customer.Id).Skip(queryCustomer.SkipData).Take(queryCustomer.DataPerPage).ToListAsync();
            return queryResult;
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
