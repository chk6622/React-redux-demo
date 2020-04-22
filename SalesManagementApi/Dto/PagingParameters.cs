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

        private int pageSize = 2;

        private string orderField;

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

        

        public string OrderField
        {
            set
            {
                this.orderField = value;
            }
            get
            {
                if (string.IsNullOrWhiteSpace(this.orderField))
                {
                    this.orderField = "id";
                }
                return this.orderField;
            }
        }
    }
}
