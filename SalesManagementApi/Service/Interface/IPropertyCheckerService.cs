using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Routine.Api.Services
{
    public interface IPropertyCheckerService
    {
        public bool TypeHasProperties<T>(string fields);
    }
}
