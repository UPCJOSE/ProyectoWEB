using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SastreriaAPI.Migrations
{
    /// <inheritdoc />
    public partial class NuevaMedida : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Medidas_Clientes_ClienteId",
                table: "Medidas");

            migrationBuilder.DropIndex(
                name: "IX_Medidas_ClienteId",
                table: "Medidas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Medidas_ClienteId",
                table: "Medidas",
                column: "ClienteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Medidas_Clientes_ClienteId",
                table: "Medidas",
                column: "ClienteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
