namespace SastreriaAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        public string TipoPrenda { get; set; } = string.Empty;

        public decimal CostoTotal { get; set; }

        public decimal SaldoPendiente { get; set; }

        public string Estado { get; set; } = "Pendiente";

        public DateTime FechaEntrega { get; set; }

        public int ClienteId { get; set; }

        public Cliente? Cliente { get; set; }
    }
}
