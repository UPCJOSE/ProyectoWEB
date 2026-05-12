namespace SastreriaAPI.Models
{
    public class MedidaPrenda
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public int PrendaCatalogoId { get; set; }
        public PrendaCatalogo? PrendaCatalogo { get; set; }

        public decimal? AjustePecho { get; set; }
        public decimal? AjusteCintura { get; set; }
        public decimal? AjusteCadera { get; set; }
        public decimal? LargoEspecial { get; set; }
        public decimal? AnchoBota { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}
