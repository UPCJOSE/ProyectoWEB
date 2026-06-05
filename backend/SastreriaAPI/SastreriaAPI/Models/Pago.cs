namespace SastreriaAPI.Models
{
    public class Pago
    {
        public int Id { get; set; }

        public decimal Monto { get; set; }

        public DateTime FechaPago { get; set; }

        public string MetodoPago { get; set; } = string.Empty;

        /// <summary>Referencia persistente si el pedido fue eliminado tras el pago (ej. ORD-12).</summary>
        public string? Referencia { get; set; }

        public int? PedidoId { get; set; }
        public Pedido? Pedido { get; set; }

        public int? FacturaId { get; set; }
        public Factura? Factura { get; set; }
    }
}
