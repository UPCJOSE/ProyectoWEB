namespace SastreriaAPI.Models
{
    public class Factura
    {
        public int Id { get; set; }
        public int NumeroFactura { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public string TipoOperacion { get; set; } = string.Empty; // compra, venta, alquiler
        public decimal Subtotal { get; set; }
        public decimal IVA { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; } = "pendiente"; // pendiente, pagada, cancelada

        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        public ICollection<DetalleFactura> Detalles { get; set; } = new List<DetalleFactura>();
    }
}
