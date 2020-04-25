using AutoMapper;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/// <summary>
/// 这是automapper的映射文件
/// </summary>
namespace SalesManagementApi.Profiles
{
    public class CustomerProfile:Profile
    {
        public CustomerProfile()
        {
            CreateMap<Customer, CustomerDto>();
            CreateMap<CustomerDto, Customer>();

        }
    }
}
