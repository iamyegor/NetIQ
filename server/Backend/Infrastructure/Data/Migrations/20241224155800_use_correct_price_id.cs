using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class use_correct_price_id : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "subscriptions",
                keyColumn: "id",
                keyValue: 1,
                column: "price_id_dev",
                value: "price_1QZZCzHXcNm6rEhrhlLXQCuE");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "subscriptions",
                keyColumn: "id",
                keyValue: 1,
                column: "price_id_dev",
                value: "price_1QY7mWHXcNm6rEhrmLAbAbBY");
        }
    }
}
