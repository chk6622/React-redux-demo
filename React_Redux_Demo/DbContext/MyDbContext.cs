using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SalesManagementApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace SalesManagementApi.AppDbContext
{
    public class MyDbContext: IdentityDbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {

        }
        public DbSet<Customer> Customers { set; get; }
        public DbSet<Product> Products { set; get; }
        public DbSet<Store> Stores { set; get; }
        public DbSet<Sales> Sales { set; get; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(@"Server=DESKTOP-N0AM9A1;Database=StudentManagement;Trusted_Connection=True;MultipleActiveResultSets=true");
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //modelBuilder.Seed();
        }
    }
}
