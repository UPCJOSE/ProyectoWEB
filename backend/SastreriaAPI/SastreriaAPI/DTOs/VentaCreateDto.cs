namespace SastreriaAPI.DTOs
{
    public class VentaCreateDto
    {
        public int ClienteId { get; set; }
        public List<ItemTransaccionDto> Items { get; set; } = new();
    }

    public class ItemTransaccionDto
    {
        public int PrendaId { get; set; }
        public int Cantidad { get; set; }
    }
}
