using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.Models;


namespace Onboarding_Task.AppDbContext
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

        }
    }
}
