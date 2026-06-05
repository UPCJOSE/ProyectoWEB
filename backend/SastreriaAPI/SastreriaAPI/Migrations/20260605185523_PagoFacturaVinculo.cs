using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SastreriaAPI.Migrations
{
    /// <inheritdoc />
    public partial class PagoFacturaVinculo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pagos_Pedidos_PedidoId",
                table: "Pagos");

            migrationBuilder.AlterColumn<int>(
                name: "PedidoId",
                table: "Pagos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "FacturaId",
                table: "Pagos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_FacturaId",
                table: "Pagos",
                column: "FacturaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pagos_Facturas_FacturaId",
                table: "Pagos",
                column: "FacturaId",
                principalTable: "Facturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Pagos_Pedidos_PedidoId",
                table: "Pagos",
                column: "PedidoId",
                principalTable: "Pedidos",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pagos_Facturas_FacturaId",
                table: "Pagos");

            migrationBuilder.DropForeignKey(
                name: "FK_Pagos_Pedidos_PedidoId",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_FacturaId",
                table: "Pagos");

            migrationBuilder.DropColumn(
                name: "FacturaId",
                table: "Pagos");

            migrationBuilder.AlterColumn<int>(
                name: "PedidoId",
                table: "Pagos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Pagos_Pedidos_PedidoId",
                table: "Pagos",
                column: "PedidoId",
                principalTable: "Pedidos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
