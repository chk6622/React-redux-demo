

namespace SalesManagementApi.Dto
{
    public class ProductQryDto:PagingParameters
    {
        public int Id { get; set; }
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
