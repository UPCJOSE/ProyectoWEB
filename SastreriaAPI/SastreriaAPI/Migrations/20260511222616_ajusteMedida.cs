using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SastreriaAPI.Migrations
{
    /// <inheritdoc />
    public partial class ajusteMedida : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedidaPrenda_Clientes_ClienteId",
                table: "MedidaPrenda");

            migrationBuilder.DropForeignKey(
                name: "FK_MedidaPrenda_PrendasCatalogo_PrendaCatalogoId",
                table: "MedidaPrenda");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_MedidaPrenda_MedidaPrendaId",
                table: "Pedidos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedidaPrenda",
                table: "MedidaPrenda");

            migrationBuilder.RenameTable(
                name: "MedidaPrenda",
                newName: "MedidasPrenda");

            migrationBuilder.RenameIndex(
                name: "IX_MedidaPrenda_PrendaCatalogoId",
                table: "MedidasPrenda",
                newName: "IX_MedidasPrenda_PrendaCatalogoId");

            migrationBuilder.RenameIndex(
                name: "IX_MedidaPrenda_ClienteId",
                table: "MedidasPrenda",
                newName: "IX_MedidasPrenda_ClienteId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedidasPrenda",
                table: "MedidasPrenda",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedidasPrenda_Clientes_ClienteId",
                table: "MedidasPrenda",
                column: "ClienteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedidasPrenda_PrendasCatalogo_PrendaCatalogoId",
                table: "MedidasPrenda",
                column: "PrendaCatalogoId",
                principalTable: "PrendasCatalogo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_MedidasPrenda_MedidaPrendaId",
                table: "Pedidos",
                column: "MedidaPrendaId",
                principalTable: "MedidasPrenda",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedidasPrenda_Clientes_ClienteId",
                table: "MedidasPrenda");

            migrationBuilder.DropForeignKey(
                name: "FK_MedidasPrenda_PrendasCatalogo_PrendaCatalogoId",
                table: "MedidasPrenda");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_MedidasPrenda_MedidaPrendaId",
                table: "Pedidos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedidasPrenda",
                table: "MedidasPrenda");

            migrationBuilder.RenameTable(
                name: "MedidasPrenda",
                newName: "MedidaPrenda");

            migrationBuilder.RenameIndex(
                name: "IX_MedidasPrenda_PrendaCatalogoId",
                table: "MedidaPrenda",
                newName: "IX_MedidaPrenda_PrendaCatalogoId");

            migrationBuilder.RenameIndex(
                name: "IX_MedidasPrenda_ClienteId",
                table: "MedidaPrenda",
                newName: "IX_MedidaPrenda_ClienteId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedidaPrenda",
                table: "MedidaPrenda",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedidaPrenda_Clientes_ClienteId",
                table: "MedidaPrenda",
                column: "ClienteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedidaPrenda_PrendasCatalogo_PrendaCatalogoId",
                table: "MedidaPrenda",
                column: "PrendaCatalogoId",
                principalTable: "PrendasCatalogo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_MedidaPrenda_MedidaPrendaId",
                table: "Pedidos",
                column: "MedidaPrendaId",
                principalTable: "MedidaPrenda",
                principalColumn: "Id");
        }
    }
}
