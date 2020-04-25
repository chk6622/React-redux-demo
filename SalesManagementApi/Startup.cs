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

namespace SalesManagementApi
{
    public class Startup
    {
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
            }).AddXmlDataContractSerializerFormatters(); //同时添加xml的输入和输出格式化器，如使用此方法就不用添加（1）和（2）语句了。;

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
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    // auth server base endpoint (will use to search for disco doc)
                    options.Authority = "http://localhost:5000";
                    options.Audience = "SalesManagementApi"; // required audience of access tokens
                    options.RequireHttpsMetadata = false; // dev only!
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
                            AuthorizationUrl = new Uri("http://localhost:5000/connect/authorize"),
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
                c.OAuthClientId("sales_management_client");
                c.OAuthAppName("The SalesManagementSystem's api");
                c.OAuth2RedirectUrl("http://localhost:8080/oauth2-redirect.html");
                c.OAuthScopeSeparator(" ");
                c.RoutePrefix = string.Empty;
            });
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
