using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Routine.Api.Helpers;
using SalesManagementApi.Dto;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;

namespace SalesManagementApi.Dao
{
    public interface IStoreDao:IBaseDao
    {
        /// <summary>
        /// Get all data
        /// </summary>
        /// <returns>A collection including all data</returns>
        Task<IEnumerable<Store>> QueryAll();

        /// <summary>
        /// Query data by query string
        /// </summary>
        /// <param name="queryObject">query object including query params</param>
        /// <returns>A collection of data getted from the database</returns>
        Task<PagedList<Store>> Query(StoreQryDto queryObject);

        /// <summary>
        /// Get a store by id 
        /// </summary>
        /// <param name="id">the Id of store</param>
        /// <returns>the store or null</returns>
        Task<Store> GetObjectById(int id);

        /// <summary>
        /// Add a store to database
        /// </summary>
        /// <param name="store">the store which needs to add to the database</param>
        /// <returns>true if succeed, or false</returns>
        Task<bool> Add(Store store);

        /// <summary>
        /// Update a store
        /// </summary>
        /// <param name="store">the store which needs to be update</param>
        /// <returns>true if succeed, or false</returns>
        Task<bool> Update(Store store);

        /// <summary>
        /// Delete a store
        /// </summary>
        /// <param name="id">The store's primary key</param>
        /// <returns>true if succeed, or false</returns>
        void Delete(int id);
    }
}
