using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SalesManagementApi.Validation
{
    /// <summary>
    /// This class is used to validate input data before controller
    /// </summary>
    public class ValidationFilter : IActionFilter
    {
        private List<string> ValidateUrls =new List<string>() 
        {
            "/customer/add/",
            "/customer/update/",
            "/product/add",
            "/product/update",
            "/store/add",
            "/store/update",
            "/sales/add",
            "/sales/update",
        };

        /// <summary>
        /// judge if the param is contained in the validate url list 
        /// </summary>
        /// <param name="requestPath">string</param>
        /// <returns>bool</returns>
        private bool IsContainedInValidateUrls(string requestPath)
        {
            bool bReturn = false;
            if(requestPath!=null)
            {
                foreach (var url in ValidateUrls)
                {
                    if (url.Length > requestPath.Length)
                    {
                        if (url.ToUpper().Contains(requestPath.ToUpper()))
                        {
                            bReturn = true;
                        }
                    }
                    else
                    {
                        if (requestPath.ToUpper().Contains(url.ToUpper()))
                        {
                            bReturn = true;
                        }
                    }
                    if (bReturn)
                    {
                        break;
                    }
                }
            }
            return bReturn;
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {
            //throw new NotImplementedException();
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var requestPath = context.HttpContext.Request.Path.ToString();
            if( this.IsContainedInValidateUrls(requestPath))  //if the path is in the validate urls, execute validate procedure.
            {
                if (!context.ModelState.IsValid)  //if invalid
                {
                    ValidationResult result = new ValidationResult() { Result = false }; //new a validation result

                    foreach (var item in context.ModelState.Values)
                    {
                        foreach (var error in item.Errors)
                        {
                            result.Message += error.ErrorMessage + "\n";
                        }
                    }

                    context.Result = new JsonResult(result);
                }
            }    
        }
    }
}
