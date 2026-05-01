namespace SastreriaAPI.Models
{
    public class Medida
    {
        public int Id { get; set; }

        public decimal Pecho { get; set; }

        public decimal Cintura { get; set; }

        public decimal Cadera { get; set; }

        public decimal LargoBrazo { get; set; }

        public DateTime FechaRegistro { get; set; }

        public int ClienteId { get; set; }

        public Cliente Cliente { get; set; }
    }
}
