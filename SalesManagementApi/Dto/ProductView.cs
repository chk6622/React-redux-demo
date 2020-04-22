using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Onboarding_Task.Models;

namespace Onboarding_Task.ViewModels
{
    public class ProductView:Product
    {
        private string nameQry;
        public string NameQry
        {
            set { this.nameQry = value; }

            get { return this.nameQry == null ? "" : this.nameQry; }
        }

        private int priceQry;
        public int PriceQry
        {
            set { this.priceQry = value; }

            get { return this.priceQry; }
        }

        private int dataPerPage;
        public int DataPerPage { set { this.dataPerPage = value; } get { return this.dataPerPage == 0 ? 10 : this.dataPerPage; } }

        public int SkipData { set; get; }
    }
}
