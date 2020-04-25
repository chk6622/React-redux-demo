using AutoMapper;
using SalesManagementApi.Dto;
using SalesManagementApi.Models;

/// <summary>
/// 这是automapper的映射文件
/// </summary>
namespace SalesManagementApi.Profiles
{
    public class ProductProfile:Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, ProductDto>();
            CreateMap<ProductDto, Product>();

        }
    }
}
