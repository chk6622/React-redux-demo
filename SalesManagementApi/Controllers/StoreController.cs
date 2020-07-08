using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using SalesManagementApi.Dao;
using SalesManagementApi.Models;
using SalesManagementApi.ViewModels;
using Routine.Api.Helpers;
using Routine.Api.Models;
using Routine.Api.Services;
using SalesManagementApi.Helpers;
using SalesManagementApi.Dto;

namespace SalesManagementApi.Controllers
{
    [ApiController]
    [Route("api/stores")]
    public class StoreController : ControllerBase
    {
        private readonly IStoreDao _storeDao = null;
        private readonly ILogger _logger = null;
        private readonly IPropertyMappingService _propertyMappingService = null;
        private readonly IPropertyCheckerService _propertyCheckerService = null;
        private readonly IMapper _mapper = null;
        public StoreController(IStoreDao storeDao, ILogger<StoreController> logger, IPropertyMappingService propertyMappingService, IPropertyCheckerService propertyCheckerService, IMapper mapper)
        {
            this._logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this._storeDao = storeDao ?? throw new ArgumentNullException(nameof(storeDao));
            this._propertyMappingService = propertyMappingService ?? throw new ArgumentNullException(nameof(propertyMappingService));
            this._propertyCheckerService = propertyCheckerService ?? throw new ArgumentNullException(nameof(propertyCheckerService));
            this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        }

        /// <summary>
        /// Get stores
        /// </summary>
        /// <param name="storeQryDto">Query parameters</param>
        /// <returns></returns>
        [HttpGet(Name = nameof(GetStores))]
        [HttpHead]  //Head请求不返回body，只返回head
        //[Authorize]
        public async Task<IActionResult> GetStores([FromQuery]StoreQryDto storeQryDto)
        {
            this._logger.LogInformation("enter 'GetStores' method.");

            if (!this._propertyMappingService.ValidMappingExistsFor<StoreDto, Store>(storeQryDto.OrderFields)) //check if order field exist.
            {
                return BadRequest();
            }
            if (!this._propertyCheckerService.TypeHasProperties<StoreDto>(storeQryDto.ShapeFields))
            {
                return BadRequest();
            }

            PagedList<Store> stores = await this._storeDao.Query(storeQryDto);

            var previousPageLink = stores.HasPrevious ? CreateStoresResourceUri(storeQryDto, ResourceUriType.PreviousPage) : null;
            var nextPageLink = stores.HasNext ? CreateStoresResourceUri(storeQryDto, ResourceUriType.NextPage) : null;
            var paginationMetadata = new
            {
                totalCount = stores.TotalCount,
                pageSize = stores.PageSize,
                currentPage = stores.CurrentPage,
                totalPages = stores.TotalPages,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetadata, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            }));


            var storeDtos = this._mapper.Map<IEnumerable<StoreDto>>(stores);
            //404 NotFound

            //数据塑形
            var shapedData = storeDtos.ShapData<StoreDto>(storeQryDto.ShapeFields);


            //添加Hateoas支持
            var links = CreateLinksForStore(storeQryDto, stores.HasPrevious, stores.HasNext);

            var shapedStoresWithLinks = shapedData.Select(c =>
            {
                var storeDict = c as IDictionary<string, object>;
                if (storeDict.ContainsKey("Id"))
                {
                    var storeLinks = CreateLinksForStore((int)storeDict["Id"], null);
                    storeDict.Add("links", storeLinks);
                }
                return storeDict;
            });
            var linkedCollectionResource = new
            {
                value = shapedStoresWithLinks,
                links
            };
            return Ok(linkedCollectionResource);
        }

        /// <summary>
        /// Get a store
        /// </summary>
        /// <param name="storeId">the store's id</param>
        /// <param name="shapeFields">the columns selected </param>
        /// <param name="mediaType">media type</param>
        /// <returns></returns>
        [Produces("application/json",  //set media type
            "application/vnd.company.hateoas+json"
             )
             ]
        [HttpGet("{storeId}", Name = nameof(GetStore))]
        //[Authorize]
        public async Task<IActionResult> GetStore(int storeId, string shapeFields, [FromHeader(Name = "Accept")] string mediaType)
        {
            if (!MediaTypeHeaderValue.TryParse(mediaType, out MediaTypeHeaderValue parsedMediaType))
            {
                return BadRequest();
            }

            if (!this._propertyCheckerService.TypeHasProperties<StoreDto>(shapeFields))
            {
                return BadRequest();
            }
            var store = await this._storeDao.GetObjectById(storeId);
            if (store == null)
            {
                return NotFound();
            }

            //如果mediatype以hateoas结尾
            var includeLinks = parsedMediaType.SubTypeWithoutSuffix.EndsWith("hateoas", StringComparison.InvariantCultureIgnoreCase);

            var result = this._mapper.Map<StoreDto>(store).ShapeData(shapeFields) as IDictionary<string, object>;

            if (includeLinks)
            {
                IEnumerable<LinkDto> myLinks = CreateLinksForStore(storeId, shapeFields);
                result.Add("links", myLinks);
            }

            return Ok(result);
        }

        /// <summary>
        /// Add a store
        /// </summary>
        /// <param name="store"></param>
        /// <returns></returns>
        [HttpPost(Name = nameof(AddStore))]
        //[Authorize]
        public async Task<ActionResult<StoreDto>> AddStore(StoreDto storeDto)
        {
            var store = _mapper.Map<Store>(storeDto);
            bool isSuccess = await this._storeDao.Add(store);
            var rStoreDto = this._mapper.Map<StoreDto>(store);
            return CreatedAtRoute(nameof(GetStore), new { storeId = rStoreDto.Id }, rStoreDto);
        }

        /// <summary>
        /// Get the operations type of store
        /// </summary>
        /// <returns></returns>
        [HttpOptions]
        //[Authorize]
        public IActionResult GetStoreOptions()
        {
            Response.Headers.Add("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            return Ok();
        }

        /// <summary>
        /// Delete a store
        /// </summary>
        /// <param name="storeId"></param>
        /// <returns></returns>
        [HttpDelete("{storeId}", Name = nameof(DeleteStore))]
        //[Authorize]
        public IActionResult DeleteStore(int storeId)
        {
            try
            {
                this._storeDao.Delete(storeId);
            }
            catch (System.ArgumentNullException)
            {
                return NotFound();
            }
            catch (Exception e)
            {
                e.ToString();
                return Forbid();
            }
            return NoContent();
        }

        /// <summary>
        /// Full update a store
        /// </summary>
        /// <param name="storeId"></param>
        /// <param name="storeDto"></param>
        /// <returns></returns>
        [HttpPut("{storeId}")]
        //[Authorize]
        public async Task<IActionResult> SaveOrUpdateStore(int storeId, StoreDto storeDto)
        {
            var store = await this._storeDao.GetObjectById(storeId);
            if (store == null)
            {
                return NotFound();
            }
            else
            {
                this._mapper.Map(storeDto, store);
                store.Id = storeId;
                await this._storeDao.Update(store);
            }
            var rStoreDto = this._mapper.Map<StoreDto>(store);
            return CreatedAtRoute(nameof(GetStore), new { storeId = storeId }, rStoreDto);
        }

        /// <summary>
        /// Partially update a object
        /// </summary>
        /// <param name="storeId"></param>
        /// <param name="patchDocument"></param>
        /// <returns></returns>
        [HttpPatch("{storeId}")]
        //[Authorize]
        public async Task<IActionResult> PartiallyUpdateStore(int storeId, JsonPatchDocument<StoreDto> patchDocument)
        {
            var store = await this._storeDao.GetObjectById(storeId);
            if (store == null)
            {
                var storeDto = new StoreDto();
                patchDocument.ApplyTo(storeDto, ModelState);
                if (!TryValidateModel(storeDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }
                store = this._mapper.Map<Store>(storeDto);
                store.Id = storeId;
                await this._storeDao.Add(store);


            }
            else
            {
                var storeDto = this._mapper.Map<StoreDto>(store);  //entityObj => updateObj

                patchDocument.ApplyTo(storeDto, ModelState);  //apply patch

                if (!TryValidateModel(storeDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }

                this._mapper.Map(storeDto, store);  //updateObj=>entityObj
                store.Id = storeId;
                await this._storeDao.Update(store);
            }

            var rStoreDto = this._mapper.Map<StoreDto>(store);
            return CreatedAtRoute(nameof(GetStore), new { storeId = storeId }, rStoreDto);
        }


        /// <summary>
        /// 创建翻页的url
        /// </summary>
        /// <param name="parameters"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private string CreateStoresResourceUri(StoreQryDto parameters, ResourceUriType type)
        {
            switch (type)
            {
                case ResourceUriType.PreviousPage:
                    return Url.Link(nameof(GetStores), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber - 1,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        addressQry = parameters.AddressQry,
                        orderBy = parameters.OrderFields
                    });
                case ResourceUriType.NextPage:
                    return Url.Link(nameof(GetStores), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber + 1,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        addressQry = parameters.AddressQry,
                        orderBy = parameters.OrderFields
                    });
                default:
                    return Url.Link(nameof(GetStores), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        addressQry = parameters.AddressQry,
                        orderBy = parameters.OrderFields
                    });
            }
        }

        private IEnumerable<LinkDto> CreateLinksForStore(int storeId, string fields)
        {
            var links = new List<LinkDto>();
            if (string.IsNullOrWhiteSpace(fields))
            {
                links.Add(new LinkDto(Url.Link(nameof(GetStores), new { storeId }), "self", "GET"));
            }
            else
            {
                links.Add(new LinkDto(Url.Link(nameof(GetStores), new { storeId, fields }), "self", "GET"));
            }

            links.Add(new LinkDto(Url.Link(nameof(DeleteStore), new { storeId }), "delete_store", "DELETE"));

            return links;
        }

        private IEnumerable<LinkDto> CreateLinksForStore(StoreQryDto parameters, bool hasPrevious, bool hasNext)
        {
            var links = new List<LinkDto>();
            links.Add(new LinkDto(CreateStoresResourceUri(parameters, ResourceUriType.CurrentPage), "self", "GET"));
            if (hasPrevious)
            {
                links.Add(new LinkDto(CreateStoresResourceUri(parameters, ResourceUriType.PreviousPage), "get_previous_page", "GET"));
            }
            if (hasNext)
            {
                links.Add(new LinkDto(CreateStoresResourceUri(parameters, ResourceUriType.NextPage), "get_next_page", "GET"));
            }
            return links;
        }

    }
}