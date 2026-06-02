namespace SastreriaAPI.Models
{
    public class Egreso
    {
        public int Id { get; set; }

        public string Concepto { get; set; } = string.Empty;

        public string Proveedor { get; set; } = string.Empty;

        public decimal Costo { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}
