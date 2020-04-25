using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SalesManagementApi.Dao;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;

namespace SalesManagementApi.Controllers
{
    public class StoreController : Controller
    {
        private readonly IStoreDao _storeDao = null;
        public StoreController(IStoreDao storeDao)
        {
            this._storeDao = storeDao;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> Query(StoreView storeView) 
        {
            QueryResultView<Store> stores = await this._storeDao.Query(storeView);
            
            return Json(stores);
        }

        public async Task<JsonResult> Edit(int id)
        {
            Store store = await this._storeDao.GetObjectById(id);
            return Json(store);
        }

        [HttpPost]
        public async Task<JsonResult> Update([FromBody] StoreView storeView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Update store success!",
                Result = true
            };
            Store store = storeView;
            isSuccess = await this._storeDao.Update(store);
            if (!isSuccess)
            {
                rMessage.Message = "Update store fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        [HttpPost]
        public async Task<JsonResult> Add([FromBody] StoreView storeView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Add store success!",
                Result = true
            };
            Store store = storeView;
            isSuccess = await this._storeDao.Add(store);
            if (!isSuccess)
            {
                rMessage.Message = "Add store fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        public async Task<JsonResult> Delete(int id)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Delete store success!",
                Result = true
            };
            isSuccess = await this._storeDao.Delete(id);
            if (!isSuccess)
            {
                rMessage.Message = "Delete store fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }
    }
}