using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class snake_case_stripe_customer_id : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "subscriptions",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.RenameColumn(
                name: "StripeCustomerId",
                table: "users",
                newName: "stripe_customer_id");

            migrationBuilder.InsertData(
                table: "subscriptions",
                columns: new[] { "id", "max_messages", "name", "price", "price_id_dev", "price_id_prod" },
                values: new object[] { 1, 99999999, "Plus", 20m, "price_1QY7mWHXcNm6rEhrmLAbAbBY", "price_1QX4OCHXcNm6rEhrVFa1lJVm" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "subscriptions",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.RenameColumn(
                name: "stripe_customer_id",
                table: "users",
                newName: "StripeCustomerId");

            migrationBuilder.InsertData(
                table: "subscriptions",
                columns: new[] { "id", "max_messages", "name", "price", "price_id_dev", "price_id_prod" },
                values: new object[] { 2, 99999999, "Pro", 99m, "price_1QY7mWHXcNm6rEhrmLAbAbBY", "price_1QX4OCHXcNm6rEhrVFa1lJVm" });
        }
    }
}
