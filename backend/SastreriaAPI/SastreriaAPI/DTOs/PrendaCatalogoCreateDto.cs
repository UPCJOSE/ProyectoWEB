namespace SastreriaAPI.DTOs
{
    public class PrendaCatalogoCreateDto
    {
        public string Nombre { get; set; } = string.Empty;

        public string TipoPrenda { get; set; } = string.Empty;

        public decimal PrecioBase { get; set; }

        public bool Activa { get; set; } = true;

        public IFormFile? Imagen { get; set; }
    }
}
