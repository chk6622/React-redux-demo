using AutoMapper;
using SalesManagementApi.Dto;
using SalesManagementApi.Models;

/// <summary>
/// 这是automapper的映射文件
/// </summary>
namespace SalesManagementApi.Profiles
{
    public class StoreProfile:Profile
    {
        public StoreProfile()
        {
            CreateMap<Store, StoreDto>();
            CreateMap<StoreDto, Store>();

        }
    }
}
