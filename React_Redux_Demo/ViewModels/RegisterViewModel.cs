using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Onboarding_Task.ViewModels
{
    public class RegisterViewModel
    {
        [Required]
        [Display(Name ="Email address")]
        [EmailAddress]
        public string Email { set; get; }

        [Required]
        [Display(Name ="Password")]
        [DataType(DataType.Password)]
        public string Password { set; get; }

        [DataType(DataType.Password)]
        [Display(Name ="Confirm password")]
        [Compare("Password",ErrorMessage ="The password is different with repassword. Please input again!")]
        public string ConfirmPassword { set; get; }
    }
}
