using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesManagementApi.Dto
{
    public class PagingParameters
    {
        private const int MaxPageSize = 20;

        private int pageNumber = 1;

        private int pageSize = 10;

        private string orderFields;


        public int PageNumber
        {
            get => this.pageNumber;
            set => pageNumber = value < 1 ? 1 : value;
        }

        

        public int PageSize
        {
            get => this.pageSize;
            set => pageSize = (value > MaxPageSize ? MaxPageSize : value);
        }

        public int Skip { get => (this.PageNumber - 1) * this.PageSize; }

        

        public string OrderFields
        {
            set
            {
                this.orderFields = value;
            }
            get
            {
                if (string.IsNullOrWhiteSpace(this.orderFields))
                {
                    this.orderFields = "id desc";
                }
                return this.orderFields;
            }
        }

        public string ShapeFields { set; get; }
    }
}
