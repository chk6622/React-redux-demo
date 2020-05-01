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

namespace SalesManagementApi.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerDao _customerDao = null;
        private readonly ILogger _logger = null;
        private readonly IPropertyMappingService _propertyMappingService=null;
        private readonly IPropertyCheckerService _propertyCheckerService=null;
        private readonly IMapper _mapper=null;
        public CustomerController(ICustomerDao customerDao,ILogger<CustomerController> logger, IPropertyMappingService propertyMappingService, IPropertyCheckerService propertyCheckerService, IMapper mapper)
        {
            this._logger = logger?? throw new ArgumentNullException(nameof(logger));
            this._customerDao = customerDao ?? throw new ArgumentNullException(nameof(customerDao));
            this._propertyMappingService = propertyMappingService ?? throw new ArgumentNullException(nameof(propertyMappingService));
            this._propertyCheckerService = propertyCheckerService ?? throw new ArgumentNullException(nameof(propertyCheckerService));
            this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

        }

        /// <summary>
        /// Get customers
        /// </summary>
        /// <param name="customerQryDto">Query parameters</param>
        /// <returns></returns>
        [HttpGet(Name = nameof(GetCustomers))]
        [HttpHead]  //Head请求不返回body，只返回head
        //[Authorize]
        public async Task<IActionResult> GetCustomers([FromQuery]CustomerQryDto customerQryDto) 
        {
            this._logger.LogInformation("enter 'GetCustomers' method.");

            if (!this._propertyMappingService.ValidMappingExistsFor<CustomerDto, Customer>(customerQryDto.OrderFields)) //check if order field exist.
            {
                return BadRequest();
            }
            if (!this._propertyCheckerService.TypeHasProperties<CustomerDto>(customerQryDto.ShapeFields))
            {
                return BadRequest();
            }

            PagedList<Customer> customers = await this._customerDao.Query(customerQryDto);

            var previousPageLink = customers.HasPrevious ? CreateCustomersResourceUri(customerQryDto, ResourceUriType.PreviousPage) : null;
            var nextPageLink = customers.HasNext ? CreateCustomersResourceUri(customerQryDto, ResourceUriType.NextPage) : null;
            var paginationMetadata = new
            {
                totalCount = customers.TotalCount,
                pageSize = customers.PageSize,
                currentPage = customers.CurrentPage,
                totalPages = customers.TotalPages,
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetadata, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            }));


            var customerDtos = this._mapper.Map<IEnumerable<CustomerDto>>(customers);
            //404 NotFound

            //数据塑形
            var shapedData = customerDtos.ShapData<CustomerDto>(customerQryDto.ShapeFields);


            //添加Hateoas支持
            var links = CreateLinksForCustomer(customerQryDto, customers.HasPrevious, customers.HasNext);

            var shapedCustomersWithLinks = shapedData.Select(c =>
            {
                var customerDict = c as IDictionary<string, object>;
                if(customerDict.ContainsKey("Id"))
                {
                    var customerLinks = CreateLinksForCustomer((int)customerDict["Id"], null);
                    customerDict.Add("links", customerLinks);
                }
                return customerDict;
            });
            var linkedCollectionResource = new
            {
                value = shapedCustomersWithLinks,
                links
            };
            return Ok(linkedCollectionResource);
        }

        /// <summary>
        /// Get a customer
        /// </summary>
        /// <param name="customerId">the customer's id</param>
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
        [HttpGet("{customerId}", Name = nameof(GetCustomer))] 
        public async Task<IActionResult> GetCustomer(int customerId, string shapeFields, [FromHeader(Name = "Accept")] string mediaType)
        {
            if (!MediaTypeHeaderValue.TryParse(mediaType, out MediaTypeHeaderValue parsedMediaType))
            {
                return BadRequest();
            }

            if (!this._propertyCheckerService.TypeHasProperties<CustomerDto>(shapeFields))
            {
                return BadRequest();
            }
            var customer = await this._customerDao.GetObjectById(customerId);
            if (customer == null)
            {
                return NotFound();
            }

            //如果mediatype以hateoas结尾
            var includeLinks = parsedMediaType.SubTypeWithoutSuffix.EndsWith("hateoas", StringComparison.InvariantCultureIgnoreCase);

            var result = this._mapper.Map<CustomerDto>(customer).ShapeData(shapeFields) as IDictionary<string, object>;

            if (includeLinks)
            {
                IEnumerable<LinkDto>  myLinks = CreateLinksForCustomer(customerId, shapeFields);
                result.Add("links", myLinks);
            }

            return Ok(result);
        }

        /// <summary>
        /// Add a customer
        /// </summary>
        /// <param name="customer"></param>
        /// <returns></returns>
        [HttpPost(Name = nameof(AddCustomer))]
        public async Task<ActionResult<CustomerDto>> AddCustomer(CustomerDto customer)
        {
            var entity = _mapper.Map<Customer>(customer);
            bool isSuccess=await this._customerDao.Add(entity);
            var rDto = this._mapper.Map<CustomerDto>(entity);
            /*var links = CreateLinksForCustomer(rDto.Id, null);  //添加HATEOAS支持
            var linkedDict = rDto.ShapeData(null) as IDictionary<string, object>;
            linkedDict.Add("links", links);*/
            return CreatedAtRoute(nameof(GetCustomer), new { customerId = rDto.Id }, rDto);
        }

        /// <summary>
        /// Get the operations type of customer
        /// </summary>
        /// <returns></returns>
        [HttpOptions]
        public IActionResult GetCustomerOptions()
        {
            Response.Headers.Add("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            return Ok();
        }

        /// <summary>
        /// Delete a customer
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        [HttpDelete("{customerId}", Name = nameof(DeleteCustomer))]
        public IActionResult DeleteCustomer(int customerId)
        {
            /*var entity = await this._customerDao.GetObjectById(customerId);
            if (entity == null)
            {
                return NotFound();
            }*/
            try
            {
                this._customerDao.Delete(customerId);
            }
            catch(System.ArgumentNullException)
            {
                return NotFound();
            }
            catch(Exception e)
            {
                e.ToString();
                return Forbid();
            }
            
            return NoContent();
        }

        /// <summary>
        /// Full update a customer
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="customerDto"></param>
        /// <returns></returns>
        [HttpPut("{customerId}")]
        public async Task<IActionResult> SaveOrUpdateCustomer(int customerId, CustomerDto customerDto)
        {
            var customer=await this._customerDao.GetObjectById(customerId);
            if (customer == null)
            {
                customer = this._mapper.Map<Customer>(customerDto);
                customer.Id = customerId;
                await this._customerDao.Add(customer);
            }
            else
            {
                this._mapper.Map(customerDto, customer);
                customer.Id = customerId;
                await this._customerDao.Update(customer);   
            }
            var rCustomerDto = this._mapper.Map<CustomerDto>(customer);
            return CreatedAtRoute(nameof(GetCustomer), new { customerId = customerId }, rCustomerDto);
        }

        /// <summary>
        /// Partially update a object
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="patchDocument"></param>
        /// <returns></returns>
        [HttpPatch("{customerId}")]
        public async Task<IActionResult> PartiallyUpdateCustomer(int customerId, JsonPatchDocument<CustomerDto> patchDocument)
        {
            var customer = await this._customerDao.GetObjectById(customerId);
            if (customer == null)
            {
                var customerDto = new CustomerDto();
                patchDocument.ApplyTo(customerDto, ModelState);
                if (!TryValidateModel(customerDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }
                customer = this._mapper.Map<Customer>(customerDto);
                customer.Id = customerId;
                await this._customerDao.Add(customer);

                
            }
            else
            {
                var customerDto = this._mapper.Map<CustomerDto>(customer);  //entityObj => updateObj

                patchDocument.ApplyTo(customerDto, ModelState);  //apply patch

                if (!TryValidateModel(customerDto))  //验证输入是否合法
                {
                    return ValidationProblem(ModelState);
                }

                this._mapper.Map(customerDto, customer);  //updateObj=>entityObj
                customer.Id = customerId;
                await this._customerDao.Update(customer);
            }

            var rCustomerDto = this._mapper.Map<CustomerDto>(customer);
            return CreatedAtRoute(nameof(GetCustomer), new { customerId = customerId }, rCustomerDto);
        }


        /// <summary>
        /// 创建翻页的url
        /// </summary>
        /// <param name="parameters"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private string CreateCustomersResourceUri(CustomerQryDto parameters, ResourceUriType type)
        {
            switch (type)
            {
                case ResourceUriType.PreviousPage:
                    return Url.Link(nameof(GetCustomers), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber - 1,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        addressQry = parameters.AddressQry,
                        orderBy = parameters.OrderFields
                    });
                case ResourceUriType.NextPage:
                    return Url.Link(nameof(GetCustomers), new
                    {
                        fields = parameters.ShapeFields,
                        pageNumber = parameters.PageNumber + 1,
                        pageSize = parameters.PageSize,
                        nameQry = parameters.NameQry,
                        addressQry = parameters.AddressQry,
                        orderBy = parameters.OrderFields
                    });
                default:
                    return Url.Link(nameof(GetCustomers), new
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

        private IEnumerable<LinkDto> CreateLinksForCustomer(int customerId, string fields)
        {
            var links = new List<LinkDto>();
            if (string.IsNullOrWhiteSpace(fields))
            {
                links.Add(new LinkDto(Url.Link(nameof(GetCustomers), new { customerId }), "self", "GET"));
            }
            else
            {
                links.Add(new LinkDto(Url.Link(nameof(GetCustomers), new { customerId, fields }), "self", "GET"));
            }

            links.Add(new LinkDto(Url.Link(nameof(DeleteCustomer), new { customerId }), "delete_customer", "DELETE"));

            return links;
        }

        private IEnumerable<LinkDto> CreateLinksForCustomer(CustomerQryDto parameters, bool hasPrevious, bool hasNext)
        {
            var links = new List<LinkDto>();
            links.Add(new LinkDto(CreateCustomersResourceUri(parameters, ResourceUriType.CurrentPage), "self", "GET"));
            if (hasPrevious)
            {
                links.Add(new LinkDto(CreateCustomersResourceUri(parameters, ResourceUriType.PreviousPage), "get_previous_page", "GET"));
            }
            if (hasNext)
            {
                links.Add(new LinkDto(CreateCustomersResourceUri(parameters, ResourceUriType.NextPage), "get_next_page", "GET"));
            }
            return links;
        }

    }
}