using Microsoft.EntityFrameworkCore.Migrations;

namespace SalesManagementApi.Migrations
{
    public partial class AddNewSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CustomerId", "ProductId", "StoreId" },
                values: new object[] { 1, 2, 3 });

            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CustomerId", "ProductId", "StoreId" },
                values: new object[] { 3, 5, 1 });

            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CustomerId", "ProductId", "StoreId" },
                values: new object[] { 5, 2, 5 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CustomerId", "ProductId", "StoreId" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CustomerId", "ProductId", "StoreId" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Sales",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CustomerId", "ProductId", "StoreId" },
                values: new object[] { null, null, null });
        }
    }
}
