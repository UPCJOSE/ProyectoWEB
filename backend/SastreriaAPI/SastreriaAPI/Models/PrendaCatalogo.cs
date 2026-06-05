namespace SastreriaAPI.Models
{
    public class PrendaCatalogo
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string TipoPrenda { get; set; } = string.Empty; // Camisa, Blusa, Pantalón, Falda
        public string Talla { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public string Estado { get; set; } = "disponible"; // disponible, en alquiler, en confección
        public decimal PrecioBase { get; set; } // Costo de confección / precio venta
        public decimal PrecioAlquiler { get; set; }
        public decimal ConsumoTelaAprox { get; set; } // Metros de tela aproximados
        public bool Activa { get; set; } = true;
        public string? ImagenUrl { get; set; }
    }
}
