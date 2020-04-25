using AutoMapper;
using SalesManagementApi.Dto;
using SalesManagementApi.Models;

namespace SalesManagementApi.Profiles
{
    public class SalesProfile:Profile
    {
        public SalesProfile()
        {
            CreateMap<Sales, SalesDto>();
            CreateMap<SalesDto, Sales>();

        }
    }
}
