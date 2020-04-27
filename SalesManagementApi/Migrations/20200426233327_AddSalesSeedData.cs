using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SalesManagementApi.Migrations
{
    public partial class AddSalesSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Sales",
                columns: new[] { "Id", "CustomerId", "DateSold", "ProductId", "StoreId" },
                values: new object[] { 1, null, new DateTime(2020, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null });

            migrationBuilder.InsertData(
                table: "Sales",
                columns: new[] { "Id", "CustomerId", "DateSold", "ProductId", "StoreId" },
                values: new object[] { 2, null, new DateTime(2020, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null });

            migrationBuilder.InsertData(
                table: "Sales",
                columns: new[] { "Id", "CustomerId", "DateSold", "ProductId", "StoreId" },
                values: new object[] { 3, null, new DateTime(2020, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
