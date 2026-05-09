using SastreriaAPI.Migrations;

namespace SastreriaAPI.Models
{
    public class Medida
    {
        public int Id { get; set; }

        public decimal Pecho { get; set; }

        public decimal Cintura { get; set; }

        public decimal Cadera { get; set; }

        public decimal AltoCadera { get; set; }

        public decimal Entrepeirna { get; set; }

        public decimal LargoTotal { get; set; }

        public decimal AnchoBajo { get; set; }

        public decimal LargoBrazo { get; set; }

        public decimal Cuello { get; set; }

        public decimal Hombros { get; set; }

        public decimal LargoTalle { get; set; }

        public decimal LargoTotalSuperior { get; set; }

        public DateOnly UltimaMedida { get; set; } = new DateOnly();

        public DateTime FechaRegistro { get; set; }

        public int ClienteId { get; set; }

    }
}
