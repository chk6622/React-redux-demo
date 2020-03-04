using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Onboarding_Task.Controllers
{
    public class ErrorController : Controller
    {
        [Route("Error/{status}")]
        public IActionResult Index(int status)
        {
            //switch (status)
            //{
            //    case 404:
            //        return Redirect("/");

            //}
            return View("/ErrorPage");
        }

        [Route("Error")]
        public IActionResult ErrorProcess(int status)
        {

            return Redirect("/");
        }
    }
}