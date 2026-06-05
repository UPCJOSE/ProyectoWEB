namespace SastreriaAPI.DTOs
{
    public class PrendaCreateDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string TipoPrenda { get; set; } = string.Empty;
        public string Talla { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public string Estado { get; set; } = "disponible";
        public decimal PrecioVenta { get; set; }
        public decimal PrecioAlquiler { get; set; }
        public decimal ConsumoTelaAprox { get; set; }
        public bool Activa { get; set; } = true;
        public string? ImagenUrl { get; set; }
    }
}
