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
    public class AccountController : Controller
    {
        private UserManager<IdentityUser> _userManager = null;
        private SignInManager<IdentityUser> _signInManager = null;
        private ILogger<AccountController> _logger = null;
        public AccountController(UserManager<IdentityUser> userManager,SignInManager<IdentityUser> signInManager, ILogger<AccountController> logger)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._logger = logger;
        }
        [HttpGet]
        public IActionResult Register()
        {
            this._logger.LogInformation("enter 'Register(Get)' method.");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            this._logger.LogInformation("enter 'Register(Post)' method.");
            if(ModelState.IsValid)
            {
                var user = new IdentityUser {UserName=model.Email,Email=model.Email };
                var result = await this._userManager.CreateAsync(user, model.Password);
                if(result.Succeeded)
                {
                    await this._signInManager.SignInAsync(user,isPersistent:false);
                    TempData["Message"] = "Register success! Please input email and password to login.";
                    return RedirectToAction("Welcome", "Login");
                }
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return View(model);
            }
            return View();
        }

        public async Task<IActionResult> Logout()
        {
            await this._signInManager.SignOutAsync();
            return RedirectToAction("Index", "Login");
        }
    }
}