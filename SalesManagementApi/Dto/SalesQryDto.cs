using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesManagementApi.Dto;
using SalesManagementApi.Models;

namespace SalesManagementApi.ViewModels
{
    public class SalesQryDto:PagingParameters
    {
        public int Id { get; set; }

        //private DateTime beginDateSoldQry;
        public DateTime BeginDateSoldQry
        {
            set;get;
        }

        //private DateTime endDateSoldQry;
        public DateTime EndDateSoldQry
        {
            set; get;
        }

        public int CustomerId { get; set; }
        public int ProductId { set; get; }
        public int StoreId { set; get; }
        /*public Customer Customer { get; set; }
        public Product Product { set; get; }
        public Store Store { set; get; }

        private int customerId;
        public int CustomerId 
        {
            set
            {
                this.customerId = value;
            } 
            get 
            {
                if (this.Customer != null)
                {
                    return this.Customer.Id;
                }
                else
                {
                    return this.customerId;
                }
            } 
        }

        private int productId;
        public int ProductId 
        {
            set 
            {
                this.productId = value;
            } 
            get
            {
                if (this.Product != null)
                {
                    return this.Product.Id;
                }
                else
                {
                    return this.productId;
                }
            }
        }
        private int storeId;
        public int StoreId 
        {
            set
            {
                this.storeId = value;
            }
            get
            {
                if(this.Store!=null)
                {
                    return this.Store.Id;
                }
                else
                {
                    return this.storeId;
                }
            }
        }*/

    }
}
