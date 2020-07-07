using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using SalesManagementApi.AppDbContext;
using SalesManagementApi.Dao;
using Routine.Api.Services;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Net.Http;
using System.Net;

namespace SalesManagementApi
{
    public class Startup
    {
        private const string CORS_POLICY_NAME = "LimitRequests";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddControllers().AddNewtonsoftJson(setup => //添加对patchjson的支持
            {
                setup.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                setup.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;  //忽略循环引用
            }).AddXmlDataContractSerializerFormatters(); //同时添加xml的输入和输出格式化器，如使用此方法就不用添加（1）和（2）语句了。;

            #region CORS
            services.AddCors(c =>
            {

                // 配置策略
                c.AddPolicy(CORS_POLICY_NAME, policy =>
                {
                    // 支持多个域名端口，注意端口号后不要带/斜杆：比如localhost:8000/，是错的
                    // http://127.0.0.1:1818 和 http://localhost:1818 是不一样的，尽量写两个
                    policy
                    //.AllowAnyOrigin()
                    .WithOrigins("http://127.0.0.1:3000", "http://localhost:3000","http://127.0.0.1:5000", "http://localhost:5000" )  //允许的客户端ip
                    .WithExposedHeaders("x-pagination", "location")                  //允许的返回头信息
                    .AllowAnyHeader()//允许任意头
                    .AllowAnyMethod();//允许任意方法
                });
            });
            #endregion

            #region Model and Database
            services.AddScoped<ICustomerDao, CustomerDao>();
            services.AddScoped<IProductDao, ProductDao>();
            services.AddScoped<IStoreDao, StoreDao>();
            services.AddScoped<ISalesDao, SalesDao>();
            services.AddTransient<IPropertyMappingService, PropertyMappingService>();
            services.AddTransient<IPropertyCheckerService, PropertyCheckerService>();

            services.AddDbContext<MyDbContext>(
                option => option.UseSqlServer(Configuration.GetConnectionString("AppDBConnection"))
            );
            #endregion

            #region Automapper
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());  //注册automapper，用于对象属性映射。
            #endregion

            #region Authenication
            IdentityModelEventSource.ShowPII = true;
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    // auth server base endpoint (will use to search for disco doc)
                    options.Authority = Configuration.GetConnectionString("IdServer4Address");
                    options.Audience = "SalesManagementApi"; // required audience of access tokens
                    options.RequireHttpsMetadata = false; // dev only!
                    options.MetadataAddress = $"{Configuration.GetConnectionString("IdServer4Address")}/.well-known/openid-configuration";
                    //options.Configuration = new Microsoft.IdentityModel.Protocols.OpenIdConnect.OpenIdConnectConfiguration();
                });
            #endregion

            #region Swagger

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "SalesManagementAPI",
                    Description = "The SalesManagementSystem's API",
                    //TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "Tong Xing",
                        Email = "xingtong.aut@gmail.com",
                        //Url = new Uri("https://twitter.com/spboyer"),
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath, true); //第二个参数为true可以添加对controller的支持

                // 开启加权小锁
                c.OperationFilter<AddResponseHeadersFilter>();
                c.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();

                // 在header中添加token，传递到后台
                c.OperationFilter<SecurityRequirementsOperationFilter>();

                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Implicit = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri($"http://localhost:5001/connect/authorize"),
                            Scopes = new Dictionary<string, string>
                            {
                                {"SalesManagementApi","The SalesManagementSystem's Api"}
                            }
                        }
                    }
                });


                //c.OperationFilter<AuthResponsesOperationFilter>();
            });

            #endregion

            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            #region Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApiHelp V1");
                c.OAuthClientId("swagger_client");  //sales_management_client
                c.OAuthAppName("The SalesManagementSystem's api");
                c.OAuth2RedirectUrl("http://localhost:5000/oauth2-redirect.html");
                c.OAuthScopeSeparator(" ");
                c.RoutePrefix = string.Empty;
            });
            #endregion

            #region CORS
            //app.UseCors(CORS_POLICY_NAME);//添加 Cors 跨域中间件
            #endregion

            app.UseRouting();

            

            #region Auth
            app.UseAuthentication();
            app.UseAuthorization();
            #endregion


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
