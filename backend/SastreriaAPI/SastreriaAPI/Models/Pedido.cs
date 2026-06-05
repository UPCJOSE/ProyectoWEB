namespace SastreriaAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public int? PrendaCatalogoId { get; set; }
        public PrendaCatalogo? PrendaCatalogo { get; set; }

        public int? MedidaPrendaId { get; set; }
        public MedidaPrenda? MedidaPrenda { get; set; }

        // Datos de tela del cliente
        public decimal MetrosTela { get; set; }
        public string TipoPrenda { get; set; } = string.Empty;
        public decimal ConsumoTela { get; set; }
        public int CantidadBotones { get; set; }
        public string TipoBoton { get; set; } = string.Empty;
        public string Observaciones { get; set; } = string.Empty;

        public int? SastreId { get; set; }
        public Usuario? Sastre { get; set; }

        public decimal PrecioUnitario { get; set; }
        public decimal CostoTotal { get; set; }
        public decimal SaldoPendiente { get; set; }

        public string Estado { get; set; } = "pendiente"; // pendiente, en proceso, terminada, entregada
        public DateTime FechaPedido { get; set; } = DateTime.Now;
        public DateTime? FechaEntrega { get; set; }
    }
}
