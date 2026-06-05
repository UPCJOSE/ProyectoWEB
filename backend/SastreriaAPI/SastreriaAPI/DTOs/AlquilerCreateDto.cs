namespace SastreriaAPI.DTOs
{
    public class AlquilerCreateDto
    {
        public int ClienteId { get; set; }
        public List<ItemTransaccionDto> Items { get; set; } = new();
    }
}
