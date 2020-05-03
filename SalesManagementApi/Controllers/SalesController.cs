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
using System.Reflection.Metadata;

namespace SalesManagementApi.Controllers
{
    [ApiController]
    [Route("api/sales")]
    public class SalesController : ControllerBase
    {
        private readonly ISalesDao _salesDao = null;
        private readonly ILogger _logger = null;
        private readonly IPropertyMappingService _propertyMappingService = null;
        private readonly IPropertyCheckerService _propertyCheckerService = null;
        private readonly IMapper _mapper = null;
        public SalesController(ISalesDao salesDao, ILogger<SalesController> logger, IPropertyMappingService propertyMappingService, IPropertyCheckerService propertyCheckerService, IMapper mapper)
        {
            this._logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this._salesDao = salesDao ?? throw new ArgumentNullException(nameof(salesDao));
            this._propertyMappingService = propertyMappingService ?? throw new ArgumentNullException(nameof(propertyMappingService));
            this._propertyCheckerService = propertyCheckerService ?? throw new ArgumentNullException(nameof(propertyCheckerService));
            this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        }

        /// <summary>
        /// Get sales
        /// </summary>
        /// <param name="salesQryDto">Query parameters</param>
        /// <returns></returns>
        [HttpGet(Name = nameof(GetSaless))]
        [HttpHead]  //Head请求不返回body，只返回head
        //[Authorize]
        public async Task<IActionResult> GetSaless([FromQuery]SalesQryDto salesQryDto)
        {
            this._logger.LogInformation("enter 'GetSaless' method.");

            if (!this._propertyMappingService.ValidMappingExistsFor<SalesDto, Sales>(salesQryDto.OrderFields)) //check if order field exist.
            {
                return BadRequest();
            }
            if (!this._propertyCheckerService.TypeHasProperties<SalesDto>(salesQryDto.ShapeFields))
            {
                return BadRequest();
            }

            PagedList<Sales> saless = await this._salesDao.Query(salesQryDto);

            var previousPageLink = saless.HasPrevious ? CreateSalessResourceUri(salesQryDto, ResourceUriType.PreviousPage) : null;
            var nextPageLink = saless.HasNext ? CreateSalessResourceUri(salesQryDto, ResourceUriType.NextPage) : null;
            var paginationMetadata = new
            {
                totalCount = saless.TotalCount,
                pageSize = saless.PageSize,
                currentPage = saless.CurrentPage,
                totalPages = saless.TotalPages,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetadata, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            }));


            var salesDtos = this._mapper.Map<IEnumerable<SalesDto>>(saless);
            //404 NotFound

            //数据塑形
            var shapedData = salesDtos.ShapData<SalesDto>(salesQryDto.ShapeFields);


            //添加Hateoas支持
            var links = CreateLinksForSales(salesQryDto, saless.HasPrevious, saless.HasNext);

            var shapedSalessWithLinks = shapedData.Select(c =>
            {
                var salesDict = c as IDictionary<string, object>;
                if (salesDict.ContainsKey("Id"))
                {
                    var salesLinks = CreateLinksForSales((int)salesDict["Id"], null);
                    salesDict.Add("links", salesLinks);
                }
                return salesDict;
            });
            var linkedCollectionResource = new
            {
                value = shapedSalessWithLinks,
                links
            };
            return Ok(linkedCollectionResource);
        }

        /// <summary>
        /// Get a sales
        /// </summary>
        /// <param name="salesId">the sales's id</param>
        /// <param name="shapeFields">the columns selected </param>
        /// <param name="mediaType">media type</param>
        /// <returns></returns>
        [Produces("application/json",  //设置该资源支持的6种media type
            "application/vnd.company.hateoas+json"
             //"application/vnd.company.company.friendly+json",
             //"application/vnd.company.company.friendly.hateoas+json"
             // "application/vnd.company.company.full.hateoas+json",
             //"application/vnd.company.company.full+json")
             )
             ]
        [HttpGet("{salesId}", Name = nameof(GetSales))]
        public async Task<IActionResult> GetSales(int salesId, string shapeFields, [FromHeader(Name = "Accept")] string mediaType)
        {
            if (!MediaTypeHeaderValue.TryParse(mediaType, out MediaTypeHeaderValue parsedMediaType))
            {
                return BadRequest();
            }

            if (!this._propertyCheckerService.TypeHasProperties<SalesDto>(shapeFields))
            {
                return BadRequest();
            }
            var sales = await this._salesDao.GetObjectById(salesId);
            if (sales == null)
            {
                return NotFound();
            }

            //如果mediatype以hateoas结尾
            var includeLinks = parsedMediaType.SubTypeWithoutSuffix.EndsWith("hateoas", StringComparison.InvariantCultureIgnoreCase);

            var result = this._mapper.Map<SalesDto>(sales).ShapeData(shapeFields) as IDictionary<string, object>;

            if (includeLinks)
            {
                IEnumerable<LinkDto> myLinks = CreateLinksForSales(salesId, shapeFields);
                result.Add("links", myLinks);
            }

            return Ok(result);
        }

        /// <summary>
        /// Add a sales
        /// </summary>
        /// <param name="salesDto"></param>
        /// <returns></returns>
        [HttpPost(Name = nameof(AddSales))]
        public async Task<ActionResult<SalesDto>> AddSales(SalesDto salesDto)
        {
            var sales = _mapper.Map<Sales>(salesDto);
            bool isSuccess = await this._salesDao.Add(sales);
            sales = await this._salesDao.GetObjectById(sales.Id);
            var rSalesDto = this._mapper.Map<SalesDto>(sales);
            return CreatedAtRoute(nameof(GetSales), new { salesId = rSalesDto.Id }, rSalesDto);
        }

        /// <summary>
        /// Get the operations type of sales
        /// </summary>
        /// <returns></returns>
        [HttpOptions]
        public IActionResult GetSalesOptions()
        {
            Response.Headers.Add("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            return Ok();
        }

        /// <summary>
        /// Delete a sales
        /// </summary>
        /// <param name="salesId"></param>
        /// <returns></returns>
        [HttpDelete("{salesId}", Name = nameof(DeleteSales))]
        public IActionResult DeleteSales(int salesId)
        {
            try
            {
                this._salesDao.Delete(salesId);
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
        /// Full update a sales
        /// </summary>
        /// <param name="salesId"></param>
        /// <param name="salesDto"></param>
        /// <returns></returns>
        [HttpPut("{salesId}")]
        public async Task<IActionResult> SaveOrUpdateSales(int salesId, SalesDto salesDto)
        {
            var sales = await this._salesDao.GetObjectById(salesId);
            if (sales == null)
            {
                /*sales = this._mapper.Map<Sales>(salesDto);
                sales.Id = salesId;
                await this._salesDao.Add(sales);*/
                return NotFound();
            }
            else
            {
                //this._mapper.Map(salesDto, sales);
                //sales.Id = salesId;
                sales.CustomerId = salesDto.CustomerId;
                sales.ProductId = salesDto.ProductId;
                sales.StoreId = salesDto.StoreId;
                sales.DateSold = salesDto.DateSold;
                await this._salesDao.Update(sales);
            }
            sales = await this._salesDao.GetObjectById(sales.Id);
            var rSalesDto = this._mapper.Map<SalesDto>(sales);
            return CreatedAtRoute(nameof(GetSales), new { salesId = salesId }, rSalesDto);
        }

        /// <summary>
        /// Partially update a object
        /// </summary>
        /// <param name="salesId"></param>
        /// <param name="patchDocument"></param>
        /// <returns></returns>
        [HttpPatch("{salesId}")]
        public async Task<IActionResult> PartiallyUpdateSales(int salesId, JsonPatchDocument<SalesDto> patchDocument)
        {
            var sales = await this._salesDao.GetObjectById(salesId);
            if (sales == null)
            {
                var salesDto = new SalesDto();
                patchDocument.ApplyTo(salesDto, ModelState);
                if (!TryValidateModel(salesDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }
                sales = this._mapper.Map<Sales>(salesDto);
                sales.Id = salesId;
                await this._salesDao.Add(sales);


            }
            else
            {
                var salesDto = this._mapper.Map<SalesDto>(sales);  //entityObj => updateObj

                patchDocument.ApplyTo(salesDto, ModelState);  //apply patch

                if (!TryValidateModel(salesDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }

                this._mapper.Map(salesDto, sales);  //updateObj=>entityObj
                sales.Id = salesId;
                await this._salesDao.Update(sales);
            }
            sales = await this._salesDao.GetObjectById(sales.Id);
            var rSalesDto = this._mapper.Map<SalesDto>(sales);
            return CreatedAtRoute(nameof(GetSales), new { salesId = salesId }, rSalesDto);
        }


        /// <summary>
        /// 创建翻页的url
        /// </summary>
        /// <param name="parameters"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private string CreateSalessResourceUri(SalesQryDto parameters, ResourceUriType type)
        {
            switch (type)
            {
                case ResourceUriType.PreviousPage:
                    return Url.Link(nameof(GetSaless), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber - 1,
                        pageSize = parameters.PageSize,
                        beginDateSoldQry = parameters.BeginDateSoldQry,
                        endDateSoldQry = parameters.EndDateSoldQry,
                        customerId=parameters.CustomerId,
                        productId=parameters.ProductId,
                        storeId=parameters.StoreId,
                        orderBy = parameters.OrderFields
                    });
                case ResourceUriType.NextPage:
                    return Url.Link(nameof(GetSaless), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber + 1,
                        pageSize = parameters.PageSize,
                        beginDateSoldQry = parameters.BeginDateSoldQry,
                        endDateSoldQry = parameters.EndDateSoldQry,
                        customerId = parameters.CustomerId,
                        productId = parameters.ProductId,
                        storeId = parameters.StoreId,
                        orderBy = parameters.OrderFields
                    });
                default:
                    return Url.Link(nameof(GetSaless), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber,
                        pageSize = parameters.PageSize,
                        beginDateSoldQry = parameters.BeginDateSoldQry,
                        endDateSoldQry = parameters.EndDateSoldQry,
                        customerId = parameters.CustomerId,
                        productId = parameters.ProductId,
                        storeId = parameters.StoreId,
                        orderBy = parameters.OrderFields
                    });
            }
        }

        private IEnumerable<LinkDto> CreateLinksForSales(int salesId, string fields)
        {
            var links = new List<LinkDto>();
            if (string.IsNullOrWhiteSpace(fields))
            {
                links.Add(new LinkDto(Url.Link(nameof(GetSaless), new { salesId }), "self", "GET"));
            }
            else
            {
                links.Add(new LinkDto(Url.Link(nameof(GetSaless), new { salesId, fields }), "self", "GET"));
            }

            links.Add(new LinkDto(Url.Link(nameof(DeleteSales), new { salesId }), "delete_sales", "DELETE"));

            return links;
        }

        private IEnumerable<LinkDto> CreateLinksForSales(SalesQryDto parameters, bool hasPrevious, bool hasNext)
        {
            var links = new List<LinkDto>();
            links.Add(new LinkDto(CreateSalessResourceUri(parameters, ResourceUriType.CurrentPage), "self", "GET"));
            if (hasPrevious)
            {
                links.Add(new LinkDto(CreateSalessResourceUri(parameters, ResourceUriType.PreviousPage), "get_previous_page", "GET"));
            }
            if (hasNext)
            {
                links.Add(new LinkDto(CreateSalessResourceUri(parameters, ResourceUriType.NextPage), "get_next_page", "GET"));
            }
            return links;
        }

    }
}