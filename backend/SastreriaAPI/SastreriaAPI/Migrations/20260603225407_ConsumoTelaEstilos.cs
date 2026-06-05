using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SastreriaAPI.Migrations
{
    /// <inheritdoc />
    public partial class ConsumoTelaEstilos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ConsumoTelaAprox",
                table: "PrendasCatalogo",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsumoTelaAprox",
                table: "PrendasCatalogo");
        }
    }
}
