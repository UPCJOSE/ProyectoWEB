namespace SastreriaAPI.DTOs
{
    public class OrdenCreateDto
    {
        public int ClienteId { get; set; }
        public int? PrendaCatalogoId { get; set; }
        public int? MedidaPrendaId { get; set; }

        public decimal MetrosTela { get; set; }
        public string TipoPrenda { get; set; } = string.Empty;
        public decimal ConsumoTela { get; set; }
        public int CantidadBotones { get; set; }
        public string TipoBoton { get; set; } = string.Empty;
        public string Observaciones { get; set; } = string.Empty;
        public int? SastreId { get; set; }
        public string Estado { get; set; } = "pendiente";
        public DateTime? FechaEntrega { get; set; }
    }
}
