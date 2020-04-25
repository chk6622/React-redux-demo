using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace SalesManagementApi.Utils
{
    public class AppUtils
    {
        /// Copy the same name proporties between two object by reflection
        /// The function create a new object
        /// </summary>
        /// <typeparam name="D">destination object class</typeparam>
        /// <typeparam name="S">source object class</typeparam>
        /// <param name="s">source object</param>
        /// <returns>destination object</returns>
        public static D Mapper<D, S>(S s)
        {
            D d = Activator.CreateInstance<D>(); //create a new instance
            try
            {
                var Types = s.GetType();//get the class of source  
                var Typed = typeof(D);
                foreach (PropertyInfo sp in Types.GetProperties())//get proporties of source class  
                {
                    foreach (PropertyInfo dp in Typed.GetProperties())
                    {
                        if (dp.Name == sp.Name && dp.PropertyType == sp.PropertyType && dp.Name != "Error" && dp.Name != "Item")//determine if the properties's name is the same   
                        {
                            dp.SetValue(d, sp.GetValue(s, null), null);//copy the value of source object properties to the destination object
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return d;
        }

        /// <summary>
        /// Copy the same name proporties between two object by reflection
        /// The function does not create the new object
        /// </summary>
        /// <typeparam name="D">destination object class</typeparam>
        /// <typeparam name="S">source object class</typeparam>
        /// <param name="s">source object</param>
        /// <returns>destination object</returns>
        /// <returns></returns>
        public static void MapperToModel<D, S>(D d, S s)
        {
            try
            {
                var Types = s.GetType();//get the class of source  
                var Typed = typeof(D);
                foreach (PropertyInfo sp in Types.GetProperties())//get proporties of source class  
                {
                    foreach (PropertyInfo dp in Typed.GetProperties())
                    {
                        if (dp.Name == sp.Name && dp.PropertyType == sp.PropertyType && dp.Name != "Error" && dp.Name != "Item")//determine if the properties's name is the same   
                        {
                            dp.SetValue(d, sp.GetValue(s, null), null);//copy the value of source object properties to the destination object
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
