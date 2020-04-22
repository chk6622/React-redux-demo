using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Onboarding_Task.Models
{
    public class Store
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { set; get; }
        [Required(ErrorMessage ="{0} can't be NULL!")]
        [StringLength(50,ErrorMessage ="{0} length must be between {2} and {0}",MinimumLength =2)]
        public string Name { set; get; }
        [Required(ErrorMessage = "{0} can't be NULL!")]
        [StringLength(100, ErrorMessage = "{0} length must be between {2} and {0}", MinimumLength = 2)]
        public string Address { set; get; }

        public List<Sales> ProductSold { set; get; }
    }
}
