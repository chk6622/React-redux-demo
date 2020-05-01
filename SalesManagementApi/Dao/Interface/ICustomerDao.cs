using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;
using Routine.Api.Helpers;

namespace SalesManagementApi.Dao
{
    public interface ICustomerDao:IBaseDao
    {
        /// <summary>
        /// Get all data
        /// </summary>
        /// <returns>A collection including all data</returns>
        Task<IEnumerable<Customer>> QueryAll();

        /// <summary>
        /// Query data by 'queryCustomer' object
        /// </summary>
        /// <param name="queryCustomer">CustomerView object including query params</param>
        /// <returns>A collection of data getted from the database</returns>
        Task<PagedList<Customer>> Query(CustomerQryDto queryCustomer);

        /// <summary>
        /// Get a customer by id 
        /// </summary>
        /// <param name="id">the Id of customer</param>
        /// <returns>the customer or null</returns>
        Task<Customer> GetObjectById(int id);

        /// <summary>
        /// Add a customer to database
        /// </summary>
        /// <param name="customer">the customer which needs to add to the database</param>
        /// <returns>true if succeed, or false</returns>
        Task<bool> Add(Customer customer);

        /// <summary>
        /// Update a customer
        /// </summary>
        /// <param name="customer">the customer which needs to be update</param>
        /// <returns>true if succeed, or false</returns>
        Task<bool> Update(Customer customer);

        /// <summary>
        /// Delete a customer
        /// </summary>
        /// <param name="id">The customer's primary key</param>
        /// <returns>true if succeed, or false</returns>
        void Delete(int id);
    }
}
