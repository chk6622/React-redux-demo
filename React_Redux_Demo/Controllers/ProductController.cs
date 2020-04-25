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
    public class ProductController : Controller
    {
        private readonly IProductDao _productDao = null;
        public ProductController(IProductDao productDao)
        {
            this._productDao = productDao;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> Query(ProductView productView) 
        {
            QueryResultView<Product> products = await this._productDao.Query(productView);
            //var product = null;
            //object model=null;
            //foreach (var product in products)
            //{
            //    model = product;
            //}
            return Json(products);
        }

        public async Task<JsonResult> Edit(int id)
        {
            Product product = await this._productDao.GetObjectById(id);
            return Json(product);
        }

        [HttpPost]
        public async Task<JsonResult> Update([FromBody] ProductView productView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Update product success!",
                Result = true
            };
            Product product = productView;
            isSuccess = await this._productDao.Update(product);
            if (!isSuccess)
            {
                rMessage.Message = "Update product fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        [HttpPost]
        public async Task<JsonResult> Add([FromBody] ProductView productView)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Add product success!",
                Result = true
            };
            Product product = productView;
            isSuccess = await this._productDao.Add(product);
            if (!isSuccess)
            {
                rMessage.Message = "Add product fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }

        public async Task<JsonResult> Delete(int id)
        {
            bool isSuccess = false;
            ActionMessage rMessage = new ActionMessage()
            {
                Message = "Delete product success!",
                Result = true
            };
            isSuccess = await this._productDao.Delete(id);
            if (!isSuccess)
            {
                rMessage.Message = "Delete product fail!";
                rMessage.Result = false;
            }
            return Json(rMessage);
        }
    }
}