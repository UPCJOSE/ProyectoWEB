using Microsoft.EntityFrameworkCore;

namespace SastreriaAPI.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Medida> Medidas { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Material> Materiales { get; set; }
    }
}
