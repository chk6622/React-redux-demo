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
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductDao _productDao = null;
        private readonly ILogger _logger = null;
        private readonly IPropertyMappingService _propertyMappingService = null;
        private readonly IPropertyCheckerService _propertyCheckerService = null;
        private readonly IMapper _mapper = null;
        public ProductController(IProductDao productDao, ILogger<ProductController> logger, IPropertyMappingService propertyMappingService, IPropertyCheckerService propertyCheckerService, IMapper mapper)
        {
            this._logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this._productDao = productDao ?? throw new ArgumentNullException(nameof(productDao));
            this._propertyMappingService = propertyMappingService ?? throw new ArgumentNullException(nameof(propertyMappingService));
            this._propertyCheckerService = propertyCheckerService ?? throw new ArgumentNullException(nameof(propertyCheckerService));
            this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        }

        /// <summary>
        /// Get products
        /// </summary>
        /// <param name="productQryDto">Query parameters</param>
        /// <returns></returns>
        [HttpGet(Name = nameof(GetProducts))]
        [HttpHead]  //Head请求不返回body，只返回head
        //[Authorize]
        public async Task<IActionResult> GetProducts([FromQuery]ProductQryDto productQryDto)
        {
            this._logger.LogInformation("enter 'GetProducts' method.");

            if (!this._propertyMappingService.ValidMappingExistsFor<ProductDto, Product>(productQryDto.OrderFields)) //check if order field exist.
            {
                return BadRequest();
            }
            if (!this._propertyCheckerService.TypeHasProperties<ProductDto>(productQryDto.ShapeFields))
            {
                return BadRequest();
            }

            PagedList<Product> products = await this._productDao.Query(productQryDto);

            var previousPageLink = products.HasPrevious ? CreateProductsResourceUri(productQryDto, ResourceUriType.PreviousPage) : null;
            var nextPageLink = products.HasNext ? CreateProductsResourceUri(productQryDto, ResourceUriType.NextPage) : null;
            var paginationMetadata = new
            {
                totalCount = products.TotalCount,
                pageSize = products.PageSize,
                currentPage = products.CurrentPage,
                totalPages = products.TotalPages,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetadata, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            }));


            var productDtos = this._mapper.Map<IEnumerable<ProductDto>>(products);
            //404 NotFound

            //数据塑形
            var shapedData = productDtos.ShapData<ProductDto>(productQryDto.ShapeFields);


            //添加Hateoas支持
            var links = CreateLinksForProduct(productQryDto, products.HasPrevious, products.HasNext);

            var shapedProductsWithLinks = shapedData.Select(c =>
            {
                var productDict = c as IDictionary<string, object>;
                if (productDict.ContainsKey("Id"))
                {
                    var productLinks = CreateLinksForProduct((int)productDict["Id"], null);
                    productDict.Add("links", productLinks);
                }
                return productDict;
            });
            var linkedCollectionResource = new
            {
                value = shapedProductsWithLinks,
                links
            };
            return Ok(linkedCollectionResource);
        }

        /// <summary>
        /// Get a product
        /// </summary>
        /// <param name="productId">the product's id</param>
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
        [HttpGet("{productId}", Name = nameof(GetProduct))]
        public async Task<IActionResult> GetProduct(int productId, string shapeFields, [FromHeader(Name = "Accept")] string mediaType)
        {
            if (!MediaTypeHeaderValue.TryParse(mediaType, out MediaTypeHeaderValue parsedMediaType))
            {
                return BadRequest();
            }

            if (!this._propertyCheckerService.TypeHasProperties<ProductDto>(shapeFields))
            {
                return BadRequest();
            }
            var product = await this._productDao.GetObjectById(productId);
            if (product == null)
            {
                return NotFound();
            }

            //如果mediatype以hateoas结尾
            var includeLinks = parsedMediaType.SubTypeWithoutSuffix.EndsWith("hateoas", StringComparison.InvariantCultureIgnoreCase);

            var result = this._mapper.Map<ProductDto>(product).ShapeData(shapeFields) as IDictionary<string, object>;

            if (includeLinks)
            {
                IEnumerable<LinkDto> myLinks = CreateLinksForProduct(productId, shapeFields);
                result.Add("links", myLinks);
            }

            return Ok(result);
        }

        /// <summary>
        /// Add a product
        /// </summary>
        /// <param name="product"></param>
        /// <returns></returns>
        [HttpPost(Name = nameof(AddProduct))]
        public async Task<ActionResult<ProductDto>> AddProduct(ProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            bool isSuccess = await this._productDao.Add(product);
            var rProductDto = this._mapper.Map<ProductDto>(product);
            /*var links = CreateLinksForProduct(rDto.Id, null);  //添加HATEOAS支持
            var linkedDict = rDto.ShapeData(null) as IDictionary<string, object>;
            linkedDict.Add("links", links);*/
            return CreatedAtRoute(nameof(GetProduct), new { productId = rProductDto.Id }, rProductDto);
        }

        /// <summary>
        /// Get the operations type of product
        /// </summary>
        /// <returns></returns>
        [HttpOptions]
        public IActionResult GetProductOptions()
        {
            Response.Headers.Add("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            return Ok();
        }

        /// <summary>
        /// Delete a product
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpDelete("{productId}", Name = nameof(DeleteProduct))]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            var entity = await this._productDao.GetObjectById(productId);
            if (entity == null)
            {
                return NotFound();
            }
            await this._productDao.Delete(productId);
            return NoContent();
        }

        /// <summary>
        /// Full update a product
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="productDto"></param>
        /// <returns></returns>
        [HttpPut("{productId}")]
        public async Task<IActionResult> SaveOrUpdateProduct(int productId, ProductDto productDto)
        {
            var product = await this._productDao.GetObjectById(productId);
            if (product == null)
            {
                product = this._mapper.Map<Product>(productDto);
                product.Id = productId;
                await this._productDao.Add(product);
            }
            else
            {
                this._mapper.Map(productDto, product);
                product.Id = productId;
                await this._productDao.Update(product);
            }
            var rProductDto = this._mapper.Map<ProductDto>(product);
            return CreatedAtRoute(nameof(GetProduct), new { productId = productId }, rProductDto);
        }

        /// <summary>
        /// Partially update a object
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="patchDocument"></param>
        /// <returns></returns>
        [HttpPatch("{productId}")]
        public async Task<IActionResult> PartiallyUpdateProduct(int productId, JsonPatchDocument<ProductDto> patchDocument)
        {
            var product = await this._productDao.GetObjectById(productId);
            if (product == null)
            {
                var productDto = new ProductDto();
                patchDocument.ApplyTo(productDto, ModelState);
                if (!TryValidateModel(productDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }
                product = this._mapper.Map<Product>(productDto);
                product.Id = productId;
                await this._productDao.Add(product);


            }
            else
            {
                var productDto = this._mapper.Map<ProductDto>(product);  //entityObj => updateObj

                patchDocument.ApplyTo(productDto, ModelState);  //apply patch

                if (!TryValidateModel(productDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }

                this._mapper.Map(productDto, product);  //updateObj=>entityObj
                product.Id = productId;
                await this._productDao.Update(product);
            }

            var rProductDto = this._mapper.Map<ProductDto>(product);
            return CreatedAtRoute(nameof(GetProduct), new { productId = productId }, rProductDto);
        }


        /// <summary>
        /// 创建翻页的url
        /// </summary>
        /// <param name="parameters"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private string CreateProductsResourceUri(ProductQryDto parameters, ResourceUriType type)
        {
            switch (type)
            {
                case ResourceUriType.PreviousPage:
                    return Url.Link(nameof(GetProducts), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber - 1,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        priceQry = parameters.PriceQry,
                        orderBy = parameters.OrderFields
                    });
                case ResourceUriType.NextPage:
                    return Url.Link(nameof(GetProducts), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber + 1,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        priceQry = parameters.PriceQry,
                        orderBy = parameters.OrderFields
                    });
                default:
                    return Url.Link(nameof(GetProducts), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        priceQry = parameters.PriceQry,
                        orderBy = parameters.OrderFields
                    });
            }
        }

        private IEnumerable<LinkDto> CreateLinksForProduct(int productId, string fields)
        {
            var links = new List<LinkDto>();
            if (string.IsNullOrWhiteSpace(fields))
            {
                links.Add(new LinkDto(Url.Link(nameof(GetProducts), new { productId }), "self", "GET"));
            }
            else
            {
                links.Add(new LinkDto(Url.Link(nameof(GetProducts), new { productId, fields }), "self", "GET"));
            }

            links.Add(new LinkDto(Url.Link(nameof(DeleteProduct), new { productId }), "delete_product", "DELETE"));

            return links;
        }

        private IEnumerable<LinkDto> CreateLinksForProduct(ProductQryDto parameters, bool hasPrevious, bool hasNext)
        {
            var links = new List<LinkDto>();
            links.Add(new LinkDto(CreateProductsResourceUri(parameters, ResourceUriType.CurrentPage), "self", "GET"));
            if (hasPrevious)
            {
                links.Add(new LinkDto(CreateProductsResourceUri(parameters, ResourceUriType.PreviousPage), "get_previous_page", "GET"));
            }
            if (hasNext)
            {
                links.Add(new LinkDto(CreateProductsResourceUri(parameters, ResourceUriType.NextPage), "get_next_page", "GET"));
            }
            return links;
        }

    }
}