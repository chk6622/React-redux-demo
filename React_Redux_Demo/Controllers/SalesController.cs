using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Onboarding_Task.Dao;
using Onboarding_Task.Models;
using Onboarding_Task.Utils;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Controllers
{
    public class SalesController : Controller
    {
        private readonly ISalesDao _salesDao = null;
        private readonly ICustomerDao _customerDao = null;
        private readonly IProductDao _productDao = null;
        private readonly IStoreDao _storeDao = null;
        public SalesController(ISalesDao salesDao,ICustomerDao customerDao,IProductDao productDao,IStoreDao storeDao)
        {
            this._salesDao = salesDao;
            this._customerDao = customerDao;
            this._productDao = productDao;
            this._storeDao = storeDao;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> Query(SalesView salesView) 
        {
            QueryResultView<Sales> saless = await this._salesDao.Query(salesView);
            return Json(saless);
        }

        public async Task<JsonResult> Edit(int id)
        {
            Sales sales = await this._salesDao.GetObjectById(id);
            SalesView salesView = AppUtils.Mapper<SalesView, Sales>(sales);
            return Json(salesView);
        }

        [HttpPost]
        public async Task<JsonResult> Update([FromBody] SalesView salesView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Update sales success!",
                Result = true
            };
            int customerId = salesView.CustomerId;
            if (customerId > 0)
            {
                Customer customer = await _customerDao.GetObjectById(customerId);
                salesView.Customer = customer;
            }
            int productId = salesView.ProductId;
            if (productId > 0)
            {
                Product product = await _productDao.GetObjectById(productId);
                salesView.Product = product;
            }
            int storeId = salesView.StoreId;
            if (storeId > 0)
            {
                Store store = await _storeDao.GetObjectById(storeId);
                salesView.Store = store;
            }

            isSuccess = await this._salesDao.Update(salesView);
            if (!isSuccess)
            {
                rMessage.Message = "Update sales fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        [HttpPost]
        public async Task<JsonResult> Add([FromBody] SalesView salesView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Add sales success!",
                Result = true
            };

            int customerId = salesView.CustomerId;
            if(customerId>0)
            {
                Customer customer = await _customerDao.GetObjectById(customerId);
                salesView.Customer = customer;
            }
            int productId = salesView.ProductId;
            if (productId > 0)
            {
                Product product = await _productDao.GetObjectById(productId);
                salesView.Product = product;
            }
            int storeId = salesView.StoreId;
            if (storeId > 0)
            {
                Store store = await _storeDao.GetObjectById(storeId);
                salesView.Store = store;
            }

            //Sales sales = salesView;
            isSuccess =await this._salesDao.Add(salesView);
            if (!isSuccess)
            {
                rMessage.Message = "Add sales fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        public async Task<JsonResult> Delete(int id)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Delete sales success!",
                Result = true
            };
            isSuccess = await this._salesDao.Delete(id);
            if (!isSuccess)
            {
                rMessage.Message = "Delete sales fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }
    }
}