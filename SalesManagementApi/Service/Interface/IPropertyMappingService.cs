using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Routine.Api.Services
{
    public interface IPropertyMappingService
    {
        /// <summary>
        /// Get the mapping  of the same properties of two objects
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDestination"></typeparam>
        /// <returns></returns>
        Dictionary<string, PropertyMappingValue> GetPropertyMapping<TSource, TDestination>();

        /// <summary>
        /// Validate if fileds exist in the TDestination
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDestination"></typeparam>
        /// <param name="fields"></param>
        /// <returns></returns>
        bool ValidMappingExistsFor<TSource, TDestination>(string fields);
    }
}
