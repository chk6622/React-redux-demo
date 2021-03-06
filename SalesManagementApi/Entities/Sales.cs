﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SalesManagementApi.Models
{
    public class Sales
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { set; get; }
        public Customer Customer { set; get; }
        public int CustomerId { set; get; }
        public Product Product { set; get; }

        public int ProductId { set; get; }
        public Store Store { set; get; }
        public int StoreId { set; get; }
        [Required(ErrorMessage ="{0} can't be NULL!")]
        //[StringLength(10,ErrorMessage ="{0} must be between {2} and {1}",MinimumLength =4)]
        public DateTime DateSold { set; get; }
    }
}
