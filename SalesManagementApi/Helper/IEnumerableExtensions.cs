using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Routine.Api.Helpers
{
    public static class IEnumerableExtensions
    {
        public static IEnumerable<ExpandoObject> ShapData<TSource>(this IEnumerable<TSource> source,string fields)
        {
            if(source==null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            var expandoObjectList = new List<ExpandoObject>(source.Count());

            var propertyInfoList = new List<PropertyInfo>();

            if (string.IsNullOrWhiteSpace(fields))
            {
                var propertyInfos = typeof(TSource).GetProperties(BindingFlags.Public | BindingFlags.Instance);  //获得对象的公有或实例属性
                propertyInfoList.AddRange(propertyInfos);
            }
            else 
            {
                var fieldsAfterSplit = fields.Split(",");
                foreach (var field in fieldsAfterSplit)
                {
                    var propertyName = field.Trim();
                    var propertyInfo = typeof(TSource).GetProperty(propertyName, BindingFlags.IgnoreCase|BindingFlags.Public|BindingFlags.Instance);

                    if (propertyInfo == null)
                    {
                        throw new Exception($"There is no Property:{propertyName} in {typeof(TSource)}");
                    }

                    propertyInfoList.Add(propertyInfo);
                }
            }

            foreach (TSource obj in source)
            {
                var shapeObj = new ExpandoObject();

                foreach (var propertyInfo in propertyInfoList)
                {
                    var propertyValue = propertyInfo.GetValue(obj);
                    ((IDictionary<string, object>)shapeObj).Add(propertyInfo.Name,propertyValue);  //将属性名和属性值添加到shapeObj中
                }
                expandoObjectList.Add(shapeObj);
            }
            return expandoObjectList;
        }
    }
}
