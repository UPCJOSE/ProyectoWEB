using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SastreriaAPI.Migrations
{
    /// <inheritdoc />
    public partial class Medida : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AltoCadera",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "AnchoBajo",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Cuello",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Entrepeirna",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Hombros",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LargoTalle",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LargoTotal",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LargoTotalSuperior",
                table: "Medidas",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateOnly>(
                name: "UltimaMedida",
                table: "Medidas",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AltoCadera",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "AnchoBajo",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "Cuello",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "Entrepeirna",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "Hombros",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "LargoTalle",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "LargoTotal",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "LargoTotalSuperior",
                table: "Medidas");

            migrationBuilder.DropColumn(
                name: "UltimaMedida",
                table: "Medidas");
        }
    }
}
