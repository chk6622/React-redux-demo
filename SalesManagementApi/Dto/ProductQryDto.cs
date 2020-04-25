

namespace SalesManagementApi.Dto
{
    public class ProductQryDto:PagingParameters
    {
        private string nameQry;
        public string NameQry
        {
            set { this.nameQry = value; }

            get { return this.nameQry == null ? "" : this.nameQry; }
        }

        public int PriceQry
        {
            set;

            get;
        }


    }
}
