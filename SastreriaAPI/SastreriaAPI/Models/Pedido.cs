namespace SastreriaAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public int PrendaCatalogoId { get; set; }
        public PrendaCatalogo? PrendaCatalogo { get; set; }

        public int? MedidaId { get; set; }
        public Medida? Medida { get; set; }

        public decimal PrecioUnitario { get; set; }   // se copia del catálogo al crear el pedido
        public decimal CostoTotal { get; set; }
        public decimal SaldoPendiente { get; set; }

        public string Estado { get; set; } = "Pendiente";
        public DateTime FechaPedido { get; set; } = DateTime.Now;
        public DateTime? FechaEntrega { get; set; }
    }
}
