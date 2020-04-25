
using SalesManagementApi.Dto;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Routine.Api.Services
{
    public class PropertyMappingService:IPropertyMappingService
    {
        private Dictionary<string, PropertyMappingValue> customerPropertyMapping = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{ "Id"})},
             { "Name",new PropertyMappingValue(new List<string>{ "Name"})},
              { "Address",new PropertyMappingValue(new List<string>{ "Address"})}
        };

        private Dictionary<string, PropertyMappingValue> productPropertyMapping = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{ "Id"})},
             { "Name",new PropertyMappingValue(new List<string>{ "Name"})},
              { "Price",new PropertyMappingValue(new List<string>{ "Price"})}
        };

        private Dictionary<string, PropertyMappingValue> storePropertyMapping = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{ "Id"})},
             { "Name",new PropertyMappingValue(new List<string>{ "Name"})},
              { "Address",new PropertyMappingValue(new List<string>{ "Address"})}
        };

        private Dictionary<string, PropertyMappingValue> salesPropertyMapping = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{ "Id"})},
            { "DateSold",new PropertyMappingValue(new List<string>{ "DateSold"})},
            { "Customer",new PropertyMappingValue(new List<string>{ "Customer"})},
            { "Product",new PropertyMappingValue(new List<string>{ "Product"})},
            { "Store",new PropertyMappingValue(new List<string>{ "Store"})}
        };


        private IList<IPropertyMapping> propertyMappings=new List<IPropertyMapping>();

        public PropertyMappingService()
        {
            this.propertyMappings.Add(new PropertyMapping<CustomerDto,Customer>(customerPropertyMapping));
            this.propertyMappings.Add(new PropertyMapping<ProductDto, Product>(productPropertyMapping));
            this.propertyMappings.Add(new PropertyMapping<StoreDto, Store>(storePropertyMapping));
            this.propertyMappings.Add(new PropertyMapping<SalesDto, Sales>(salesPropertyMapping));
        }
        public Dictionary<string,PropertyMappingValue> GetPropertyMapping<TSource,TDestination>()
        {
            var matchingMapping = this.propertyMappings.OfType<PropertyMapping<TSource, TDestination>>();

            if(matchingMapping.Count()==1)
            {
                return matchingMapping.First().MappingDictionary;
            }
            throw new Exception($"There is no unique mapping: {typeof(TSource)} {typeof(TDestination)}");
        }


        /// <summary>
        /// 验证TDestination中是否有fields属性
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TDestination"></typeparam>
        /// <param name="fields"></param>
        /// <returns></returns>
        public bool ValidMappingExistsFor<TSource,TDestination>(string fields)
        {
            var propertyMapping = GetPropertyMapping<TSource,TDestination>();
            if (string.IsNullOrWhiteSpace(fields))
            {
                return true;
            }
            var fieldAfterSplit = fields.Split(",");
            foreach(var field in fieldAfterSplit)
            {
                var trimmedField = field.Trim();
                var indexOfFirstSpace = trimmedField.IndexOf(" ");
                var propertyName = indexOfFirstSpace == -1 ? trimmedField : trimmedField.Remove(indexOfFirstSpace);
                if(!propertyMapping.ContainsKey(propertyName))
                {
                    return false;
                }
            }
            return true;
        }
    }
}
