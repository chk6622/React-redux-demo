using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SalesManagementApi.Models;

namespace SalesManagementApi.ViewModels
{
    public class StoreView:Store
    {
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

        private int dataPerPage;
        public int DataPerPage { set { this.dataPerPage = value; } get { return this.dataPerPage == 0 ? 10 : this.dataPerPage; } }

        public int SkipData { set; get; }
    }
}
