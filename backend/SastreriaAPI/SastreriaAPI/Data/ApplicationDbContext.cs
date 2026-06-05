using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Models;

namespace SastreriaAPI.Data
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
        public DbSet<MedidaPrenda> MedidasPrenda { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Egreso> Egresos { get; set; }
        public DbSet<Material> Materiales { get; set; }
        public DbSet<PrendaCatalogo> PrendasCatalogo { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<DetalleFactura> DetalleFacturas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DetalleFactura>()
                .HasOne(d => d.Factura)
                .WithMany(f => f.Detalles)
                .HasForeignKey(d => d.FacturaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Sastre)
                .WithMany()
                .HasForeignKey(p => p.SastreId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.PrendaCatalogo)
                .WithMany()
                .HasForeignKey(p => p.PrendaCatalogoId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Pago>()
                .HasOne(p => p.Pedido)
                .WithMany()
                .HasForeignKey(p => p.PedidoId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Pago>()
                .HasOne(p => p.Factura)
                .WithMany()
                .HasForeignKey(p => p.FacturaId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
