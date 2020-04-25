using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SalesManagementApi.Dao;
using SalesManagementApi.AppDbContext;
using System.Linq;
using SalesManagementApi.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace SalesManagementApi
{
    public class Startup
    {

        private readonly IConfiguration _configuration = null;
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /*options =>
            {
                options.Filters.Add<ValidationFilter>();
            }*/
            services.AddMvc(
                options => options.Filters.Add<ValidationFilter>()
                )
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddDbContextPool<MyDbContext>(
                options => options.UseSqlServer(_configuration.GetConnectionString("AppDBConnection"))
                );

            services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<MyDbContext>();

            /*services.AddMvc(config=> {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                config.Filters.Add(new AuthorizeFilter(policy));
            });*/

            services.Configure<IdentityOptions>(options => {
                options.Password.RequiredLength = 5;
                options.Password.RequiredUniqueChars = 3;
                options.Password.RequireNonAlphanumeric = false;
            });

            services.AddScoped<ICustomerDao, CustomerDao>();
            services.AddScoped<IProductDao, ProductDao>();
            services.AddScoped<IStoreDao, StoreDao>();
            services.AddScoped<ISalesDao, SalesDao>();


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //Sapp.UseExceptionHandler("/Error");
                //app.UseStatusCodePagesWithReExecute("/Error/{0}");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Login}/{action=Index}/{id?}");
            });


            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            UpdateDatabase(app);
        }

        private void UpdateDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<MyDbContext>())
                {

                    //if (context.Database.GetPendingMigrations().Any())
                    //{
                       // context.Database.Migrate(); //Ö´ÐÐÇ¨ÒÆ
                    //}
                }
            }
        }
    }
}
