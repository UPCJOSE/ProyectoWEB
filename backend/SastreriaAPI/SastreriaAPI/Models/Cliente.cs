using System.ComponentModel.DataAnnotations;

namespace SastreriaAPI.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public string Correo { get; set; } = string.Empty;

        public string Direccion { get; set; } = string.Empty;

        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public ICollection<Medida> Medidas { get; set; } = new List<Medida>();
        public ICollection<MedidaPrenda> MedidasPrenda { get; set; } = new List<MedidaPrenda>();
    }
}
