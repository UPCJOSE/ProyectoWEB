namespace SastreriaAPI.DTOs
{
    public class PedidoCreateDto
    {
        public int ClienteId { get; set; }

        public int PrendaCatalogoId { get; set; }

        public int? MedidaPrendaId { get; set; }

        public decimal CostoTotal { get; set; }

        public decimal SaldoPendiente { get; set; }

        public string Estado { get; set; } = "Pendiente";

        public DateTime? FechaEntrega { get; set; }
    }
}