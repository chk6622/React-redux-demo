using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SalesManagementApi.Dao;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;

namespace SalesManagementApi.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ICustomerDao _customerDao = null;
        private readonly ILogger _logger = null;
        public CustomerController(ICustomerDao customerDao,ILogger<CustomerController> logger)
        {
            this._logger = logger;
            this._customerDao = customerDao;
        }
        public IActionResult Index()
        {
            return Redirect("/");
        }

        public async Task<JsonResult> Query(CustomerView customerView) 
        {
            this._logger.LogInformation("enter 'Query' method.");
            QueryResultView<Customer> customers = await this._customerDao.Query(customerView);
            /*this._logger.LogInformation("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            this._logger.LogInformation($"Get {customers.TotalData} data.");
            foreach(Customer customer in customers.Results)
            {
                this._logger.LogInformation(customer.ToString());
            }
            this._logger.LogInformation("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            */
            return Json(customers);
        }

        public async Task<JsonResult> Edit(int id)
        {
            Customer customer = await this._customerDao.GetObjectById(id);
            return Json(customer);
        }

        [HttpPost]
        public async Task<JsonResult> Update([FromBody] CustomerView customerView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Update customer success!",
                Result = true
            };
            Customer customer = customerView;
            isSuccess = await this._customerDao.Update(customer);
            if (!isSuccess)
            {
                rMessage.Message = "Update customer fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        [HttpPost]
        public async Task<JsonResult> Add([FromBody] CustomerView customerView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage() 
            { 
                Message = "Add customer success!", 
                Result = true 
            };
            Customer customer = customerView;
            isSuccess=await this._customerDao.Add(customer);
            if (!isSuccess)
            {
                rMessage.Message= "Add customer fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        public async Task<JsonResult> Delete(int id)
        {
            bool isSuccess=false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Delete customer success!",
                Result = true
            };
            isSuccess = await this._customerDao.Delete(id);
            if (!isSuccess)
            {
                rMessage.Message = "Delete customer fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }
    }
}