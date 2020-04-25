using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SalesManagementApi.ViewModels;

namespace SalesManagementApi.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private UserManager<IdentityUser> _userManager = null;
        private SignInManager<IdentityUser> _signInManager = null;
        private ILogger<AccountController> _logger = null;
        public LoginController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, ILogger<AccountController> logger)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._logger = logger;
        }
        public IActionResult Index()
        {
            this._logger.LogInformation("enter 'Index' method");
            ViewBag.Message = TempData["Message"];
            return View();
        }

        public IActionResult Welcome()
        {
            this._logger.LogInformation("enter 'Welcome' method");
            ViewBag.Message = TempData["Message"];
            return View();
        }

        public async Task<IActionResult> Login(LoginViewModel model)
        {
            this._logger.LogInformation("enter 'Login' method");
            if(ModelState.IsValid)
            {
                var result = await this._signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    //return RedirectToAction("index", "home");
                    //return View("/Home/index");
                    return Redirect("/Home/index");
                }
                ModelState.AddModelError(string.Empty, "Login fail, please try again!");
            }
            return View("Index",model);
        }

        public async Task<IActionResult> Logout()
        {
            this._logger.LogInformation("enter 'Logout' method");
            await this._signInManager.SignOutAsync();
            //return RedirectToAction("Index");
            return Redirect("/Login/Index");
        }
    }
}