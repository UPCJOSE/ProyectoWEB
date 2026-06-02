namespace SastreriaAPI.Models
{
    public class PrendaCatalogo
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;   // Ej: Camisa slim, Pantalón clásico
        public string TipoPrenda { get; set; } = string.Empty; // Pantalón, Camisa, Vestido
        public decimal PrecioBase { get; set; }
        public bool Activa { get; set; } = true;
        public string? ImagenUrl { get; set; }
    }
}
