using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Routine.Api.Helpers;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;

namespace SalesManagementApi.Dao
{
    public interface ISalesDao:IBaseDao
    {
        /// <summary>
        /// Get all data
        /// </summary>
        /// <returns>A collection including all data</returns>
        Task<IEnumerable<Sales>> QueryAll();

        /// <summary>
        /// Query data by query string
        /// </summary>
        /// <param name="queryObject">query object including query params</param>
        /// <returns>A collection of data getted from the database</returns>
        Task<PagedList<Sales>> Query(SalesQryDto queryObject);

        /// <summary>
        /// Get a sales by id 
        /// </summary>
        /// <param name="id">the Id of sales</param>
        /// <returns>the sales or null</returns>
        Task<Sales> GetObjectById(int id);

        /// <summary>
        /// Add a sales to database
        /// </summary>
        /// <param name="sales">the sales which needs to add to the database</param>
        /// <returns>true if succeed, or false</returns>
        Task<bool> Add(Sales sales);

        /// <summary>
        /// Update a sales
        /// </summary>
        /// <param name="sales">the sales which needs to be update</param>
        /// <returns>true if succeed, or false</returns>
        Task<bool> Update(Sales sales);

        /// <summary>
        /// Delete a sales
        /// </summary>
        /// <param name="id">The sales's primary key</param>
        /// <returns>true if succeed, or false</returns>
        void Delete(int id);
    }
}
