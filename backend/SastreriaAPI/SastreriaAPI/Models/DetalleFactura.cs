namespace SastreriaAPI.Models
{
    public class DetalleFactura
    {
        public int Id { get; set; }

        public int FacturaId { get; set; }
        public Factura? Factura { get; set; }

        public int PrendaId { get; set; }
        public PrendaCatalogo? Prenda { get; set; }

        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }
}
