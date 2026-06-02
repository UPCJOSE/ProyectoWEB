namespace SastreriaAPI.DTOs
{
    public class MedidaPrendaCreateDto
    {
        public int ClienteId { get; set; }

        public int PrendaCatalogoId { get; set; }

        public decimal? AjustePecho { get; set; }

        public decimal? AjusteCintura { get; set; }

        public decimal? AjusteCadera { get; set; }

        public decimal? LargoEspecial { get; set; }

        public decimal? AnchoBota { get; set; }
    }
}
