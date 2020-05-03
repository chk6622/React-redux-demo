using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesManagementApi.Models;

namespace SalesManagementApi.Dto
{
    public class StoreQryDto:PagingParameters
    {
        public int Id { get; set; }

        private string nameQry;
        public string NameQry
        {
            set { this.nameQry = value; }

            get { return this.nameQry == null ? "" : this.nameQry; }
        }

        private string addressQry;
        public string AddressQry
        {
            set { this.addressQry = value; }

            get { return this.addressQry == null ? "" : this.addressQry; }
        }
       
    }
}
