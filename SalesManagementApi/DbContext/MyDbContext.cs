using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SalesManagementApi.Models;


namespace SalesManagementApi.AppDbContext
{
    public class MyDbContext: DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {

        }
        public DbSet<Customer> Customers { set; get; }
        public DbSet<Product> Products { set; get; }
        public DbSet<Store> Stores { set; get; }
        public DbSet<Sales> Sales { set; get; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            /* modelBuilder.Entity<Sales>()
                 .HasOne(x => x.Customer)
                 .WithMany(x => x.ProductSold)
                 .OnDelete(DeleteBehavior.Restrict);  //DeleteBehavior.Restrict:非级联删除，DeleteBehavior.Cascade:级联删除

             modelBuilder.Entity<Sales>()
                .HasOne(x => x.Product)
                .WithMany(x => x.ProductSold)
                .OnDelete(DeleteBehavior.Restrict);  //DeleteBehavior.Restrict:非级联删除，DeleteBehavior.Cascade:级联删除

             modelBuilder.Entity<Sales>()
               .HasOne(x => x.Store)
               .WithMany(x => x.ProductSold)
               .OnDelete(DeleteBehavior.Restrict);  //DeleteBehavior.Restrict:非级联删除，DeleteBehavior.Cascade:级联删除
*/
          
            modelBuilder.Entity<Sales>().HasData(
                           new
                           {
                               Id = 1,
                               CustomerId=1,
                               ProductId=2,
                               StoreId=3,
                               DateSold = new DateTime(2020, 1, 2)

                           },
                           new
                           {
                               Id = 2,
                               CustomerId = 3,
                               ProductId = 5,
                               StoreId = 1,
                               DateSold = new DateTime(2020, 1, 15)

                           },
                           new
                           {
                               Id = 3,
                               CustomerId = 5,
                               ProductId = 2,
                               StoreId = 5,
                               DateSold = new DateTime(2020, 2, 10)

                           }

                   );
            modelBuilder.Entity<Customer>().HasData(
                        new
                        {
                            Id = 1,
                            Name = "King",
                            Address = "City center"

                        },
                         new
                         {
                             Id = 2,
                             Name = "Tom",
                             Address = "Long bay"
                         },
                         new
                         {
                             Id = 3,
                             Name = "Mary",
                             Address = "Mission bay"
                         },
                        new
                        {
                            Id = 4,
                            Name = "Kate",
                            Address = "Mt Eden"
                        },
                        new
                        {
                            Id = 5,
                            Name = "Kelly",
                            Address = "Mt Albert"
                        }
                );
              modelBuilder.Entity<Product>().HasData(
                         new
                         {
                             Id = 1,
                             Name = "Banana",
                             Price = 5.0

                         },
                          new
                          {
                              Id = 2,
                              Name = "Apple",
                              Price = 3.0

                          },
                         new
                         {
                             Id = 3,
                             Name = "Orange",
                             Price = 5.0

                         },
                         new
                         {
                             Id = 4,
                             Name = "Pen",
                             Price = 7.0

                         },
                         new
                         {
                             Id = 5,
                             Name = "Note",
                             Price = 2.0

                         }
                 );

              modelBuilder.Entity<Store>().HasData(
                         new
                         {
                             Id = 1,
                             Name = "Countdown",
                             Address = "City center"
                         },
                          new
                          {
                              Id = 2,
                              Name = "Countdown",
                              Address = "Long bay"

                          },
                          new
                          {
                              Id = 3,
                              Name = "Parking Save",
                              Address = "Mission bay"

                          },
                         new
                         {
                             Id = 4,
                             Name = "Parking Save",
                             Address = "Mt Eden"

                         },
                         new
                         {
                             Id = 5,
                             Name = "New world",
                             Address = "Mt Albert"

                         }
                 );
              
        }
    }
}
