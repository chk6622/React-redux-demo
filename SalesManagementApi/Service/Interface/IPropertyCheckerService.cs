using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Routine.Api.Services
{
    public interface IPropertyCheckerService
    {
        /// <summary>
        /// validate if fields exist
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="fields">input fields</param>
        /// <returns></returns>
        public bool TypeHasProperties<T>(string fields);
    }
}
