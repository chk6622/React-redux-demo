using Routine.Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace Routine.Api.Helpers
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> ApplySort<T>(this IQueryable<T> source, string orderBy, Dictionary<string, PropertyMappingValue> mappingDictionary)
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }
            
            if (mappingDictionary == null)
            {
                throw new ArgumentNullException(nameof(mappingDictionary));
            }

            if (string.IsNullOrWhiteSpace(orderBy))
            {
                return source;
            }

            var orderByAfterSplit = orderBy.Split(",");
            bool hasAddedOne = false;
            foreach (var orderByClause in orderByAfterSplit)
            {
                var trimmedorderByClause = orderByClause.Trim();

                var orderDescending = trimmedorderByClause.ToLowerInvariant().EndsWith(" desc");  //判断是否desc

                var indexOfFirstSpace = trimmedorderByClause.IndexOf(" ");  //寻找第一个空格

                var propertyName = indexOfFirstSpace == -1 ? trimmedorderByClause : trimmedorderByClause.Remove(indexOfFirstSpace);  //如果有空格，删除空格及其后的部分

                if (!mappingDictionary.ContainsKey(propertyName))
                {
                    throw new ArgumentNullException($"There is no mapping whose key is {propertyName}");
                }

                var propertyMappingValue = mappingDictionary[propertyName];

                if(propertyMappingValue==null)
                {
                    throw new ArgumentNullException(nameof(propertyMappingValue));
                }

               
                foreach (var destinationProperty in propertyMappingValue.DestinationProperties)
                {
                    if (propertyMappingValue.Revert)
                    {
                        orderDescending = !orderDescending;
                    }

                    //source = source.OrderBy(destinationProperty + (orderDescending ? " descending" : " ascending"));
                    var oSource = source as IOrderedQueryable;
                    if (oSource!=null&& hasAddedOne)  //添加第n个order字段
                    {
                        source = ((IOrderedQueryable<T>)source).ThenBy(destinationProperty + (orderDescending ? " descending" : " ascending"));
                    }
                    else  //添加第一个order字段
                    {
                        source = source.OrderBy(destinationProperty + (orderDescending ? " descending" : " ascending"));
                        hasAddedOne = true;
                    }
                }
                
            }
            return source;
        }
    }
}
