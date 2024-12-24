using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class add_subscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "subscription_max_messages",
                table: "users");

            migrationBuilder.DropColumn(
                name: "subscription_status",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "StripeCustomerId",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "subscription_id",
                table: "users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "subscriptions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    max_messages = table.Column<int>(type: "integer", nullable: false),
                    price_id_dev = table.Column<string>(type: "text", nullable: false),
                    price_id_prod = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subscriptions", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "subscriptions",
                columns: new[] { "id", "max_messages", "name", "price", "price_id_dev", "price_id_prod" },
                values: new object[] { 2, 99999999, "Pro", 99m, "price_1QY7mWHXcNm6rEhrmLAbAbBY", "price_1QX4OCHXcNm6rEhrVFa1lJVm" });

            migrationBuilder.CreateIndex(
                name: "IX_users_subscription_id",
                table: "users",
                column: "subscription_id");

            migrationBuilder.AddForeignKey(
                name: "FK_users_subscriptions_subscription_id",
                table: "users",
                column: "subscription_id",
                principalTable: "subscriptions",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_subscriptions_subscription_id",
                table: "users");

            migrationBuilder.DropTable(
                name: "subscriptions");

            migrationBuilder.DropIndex(
                name: "IX_users_subscription_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "StripeCustomerId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "subscription_id",
                table: "users");

            migrationBuilder.AddColumn<int>(
                name: "subscription_max_messages",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "subscription_status",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
