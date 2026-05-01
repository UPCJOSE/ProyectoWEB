namespace SastreriaAPI.Models
{
    public class Material
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public int Stock { get; set; }

        public string UnidadMedida { get; set; } = string.Empty;
    }
}
