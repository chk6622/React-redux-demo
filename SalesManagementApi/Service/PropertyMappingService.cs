
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;
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

        

        private IList<IPropertyMapping> propertyMappings=new List<IPropertyMapping>();

        public PropertyMappingService()
        {
            this.propertyMappings.Add(new PropertyMapping<CustomerDto,Customer>(customerPropertyMapping));
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
