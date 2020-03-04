using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Onboarding_Task.Models
{
    public class Product
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { set; get; }
        [Required(ErrorMessage ="{0} can't be NULL!")]
        [StringLength(50,ErrorMessage ="{0} length must be between {2} and {1}!",MinimumLength =2)]
        public string Name { set; get; }
        [Required(ErrorMessage = "{0} can't be NULL!")]
        [Range(0, 10000.0,ErrorMessage ="{0} must be between {1} and {2}!")]
        public double? Price { set; get; }
        public List<Sales> ProductSold { set; get; }
    }
}
