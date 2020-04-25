using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesManagementApi.Models;

namespace SalesManagementApi.ViewModels
{
    public class SalesView:Sales
    {
        private string dateSoldQry;
        public string DateSoldQry
        {
            set
            {
                this.dateSoldQry = value;
            }
            get
            {
                return this.dateSoldQry == null ?"" : this.dateSoldQry;
            }
        }

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
        }

        private int dataPerPage;
        public int DataPerPage { set { this.dataPerPage = value; } get { return this.dataPerPage == 0 ? 10 : this.dataPerPage; } }

        public int SkipData { set; get; }

    }
}
