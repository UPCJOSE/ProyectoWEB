namespace SastreriaAPI.Models
{
    public class Medida
    {
        public int Id { get; set; }

        // Relación con cliente
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }
        
        // Medidas
        public decimal? Pecho { get; set; }

        public decimal? Cintura { get; set; }

        public decimal? Cadera { get; set; }

        public decimal? AltoCadera { get; set; }

        public decimal? Entrepierna { get; set; }

        public decimal? LargoTotal { get; set; }

        public decimal? AnchoBajo { get; set; }

        public decimal? LargoBrazo { get; set; }

        public decimal? Cuello { get; set; }

        public decimal? Hombros { get; set; }

        public decimal? LargoTalle { get; set; }

        public decimal? LargoTotalSuperior { get; set; }

        // Fechas
        public DateOnly? UltimaMedida { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.Now;

    }
}
