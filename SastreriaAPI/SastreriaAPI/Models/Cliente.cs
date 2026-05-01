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
    }
}
