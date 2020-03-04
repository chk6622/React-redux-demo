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
    public class CustomerDao : ICustomerDao
    {
        private readonly MyDbContext _context = null;

        public CustomerDao(MyDbContext myDbContext)
        {
            this._context = myDbContext;
        }
        public bool Add(Customer customer)
        {
            bool bReturn = false;
            try
            {
                _context.Add<Customer>(customer);
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
                int count1=_context.Customers.Count<Customer>();
                Customer customer=_context.Customers.Find(id);
                _context.Remove<Customer>(customer);
                _context.SaveChanges();
                int count2 = _context.Customers.Count<Customer>();
                Console.WriteLine($"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                Console.WriteLine($"There are {count1} data before deleting, and there are {count2} data after deleting.");
                Console.WriteLine($"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                bReturn = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return bReturn;
        }

        public Customer GetObjectById(int id)
        {
            Customer customer = null;
            customer = _context.Customers.Find(id);
            return customer;
        }

        public QueryResultView<Customer> Query(CustomerView queryCustomer)
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
            queryResult.TotalData = customers.Count();
            queryResult.Results = customers.OrderByDescending(customer => customer.Id).Skip(queryCustomer.SkipData).Take(queryCustomer.DataPerPage).ToList();
            return queryResult;
        }

        public IEnumerable<Customer> QueryAll()
        {
            return this._context.Customers;
        }

        public bool Update(Customer customer)
        {
            bool bReturn = false;
            try
            {
                var updateCustomer = this._context.Customers.Attach(customer);
                updateCustomer.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
