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
            modelBuilder.Entity<Customer>().HasData(
                        new Customer
                        {
                            Id = 1,
                            Name = "King",
                            Address = "City center"

                        },
                         new Customer
                         {
                             Id = 2,
                             Name = "Tom",
                             Address = "Long bay"

                         },
                         new Customer
                         {
                             Id = 3,
                             Name = "Mary",
                             Address = "Mission bay"

                         },
                        new Customer
                        {
                            Id = 4,
                            Name = "Kate",
                            Address = "Mt Eden"

                        },
                        new Customer
                        {
                            Id = 5,
                            Name = "Kelly",
                            Address = "Mt Albert"

                        }
                );
            modelBuilder.Entity<Product>().HasData(
                       new Product
                       {
                           Id = 1,
                           Name = "Banana",
                           Price = 5

                       },
                        new Product
                        {
                            Id = 2,
                            Name = "Apple",
                            Price = 3

                        },
                       new Product
                       {
                           Id = 3,
                           Name = "Orange",
                           Price = 5

                       },
                       new Product
                       {
                           Id = 4,
                           Name = "Pen",
                           Price = 7

                       },
                       new Product
                       {
                           Id = 5,
                           Name = "Note",
                           Price = 2

                       }
               );

            modelBuilder.Entity<Store>().HasData(
                       new Store
                       {
                           Id = 1,
                           Name = "Countdown",
                           Address = "City center"

                       },
                        new Store
                        {
                            Id = 2,
                            Name = "Countdown",
                            Address = "Long bay"

                        },
                        new Store
                        {
                            Id = 3,
                            Name = "Parking Save",
                            Address = "Mission bay"

                        },
                       new Store
                       {
                           Id = 4,
                           Name = "Parking Save",
                           Address = "Mt Eden"

                       },
                       new Store
                       {
                           Id = 5,
                           Name = "New world",
                           Address = "Mt Albert"

                       }
               );
           /* modelBuilder.Entity<Sales>().HasData(
                       new Sales
                       {
                           Id = 1,
                           Customer = new Customer() {
                               Id = 1,
                               Name = "King",
                               Address = "City center"
                           },
                           Product = new Product()
                           {
                               Id = 2,
                               Name = "Apple",
                               Price = 3
                           },
                           Store=new Store()
                           {
                               Id = 2,
                               Name = "Countdown",
                               Address = "Long bay"
                           },
                           DateSold=new DateTime(2020,1,2)

                       },
                       new Sales
                       {
                           Id = 2,
                           Customer = new Customer()
                           {
                               Id = 4,
                               Name = "Kate",
                               Address = "Mt Eden"
                           },
                           Product = new Product()
                           {
                               Id = 3,
                               Name = "Orange",
                               Price = 5
                           },
                           Store = new Store()
                           {
                               Id = 2,
                               Name = "Countdown",
                               Address = "Long bay"
                           },
                           DateSold = new DateTime(2020, 1, 15)

                       },
                       new Sales
                       {
                           Id = 3,
                           Customer = new Customer()
                           {
                               Id = 3,
                               Name = "Mary",
                               Address = "Mission bay"
                           },
                           Product = new Product()
                           {
                               Id = 5,
                               Name = "Note",
                               Price = 2
                           },
                           Store = new Store()
                           {
                               Id = 5,
                               Name = "New world",
                               Address = "Mt Albert"
                           },
                           DateSold = new DateTime(2020, 2, 10)

                       }

               );*/
        }
    }
}
