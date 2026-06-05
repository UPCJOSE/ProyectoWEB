using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.Models;

namespace SastreriaAPI.Services
{
    public class FacturaService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public FacturaService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<Factura> CrearFacturaAsync(
            int clienteId,
            int usuarioId,
            string tipoOperacion,
            List<ItemTransaccionDto> items,
            Func<PrendaCatalogo, decimal> obtenerPrecio)
        {
            if (items == null || items.Count == 0)
                throw new InvalidOperationException("Debe incluir al menos un ítem.");

            var cliente = await _context.Clientes.FindAsync(clienteId)
                ?? throw new InvalidOperationException("Cliente no encontrado.");

            var usuario = await _context.Usuarios.FindAsync(usuarioId)
                ?? throw new InvalidOperationException("Usuario no encontrado.");

            var detalles = new List<DetalleFactura>();
            decimal subtotal = 0;

            foreach (var item in items)
            {
                var prenda = await _context.PrendasCatalogo.FindAsync(item.PrendaId)
                    ?? throw new InvalidOperationException($"Prenda {item.PrendaId} no encontrada.");

                if (item.Cantidad <= 0)
                    throw new InvalidOperationException("La cantidad debe ser mayor a cero.");

                if (prenda.Cantidad < item.Cantidad)
                    throw new InvalidOperationException(
                        $"Stock insuficiente para '{prenda.Nombre}'. Disponible: {prenda.Cantidad}.");

                var precioUnitario = obtenerPrecio(prenda);
                var subtotalItem = precioUnitario * item.Cantidad;
                subtotal += subtotalItem;

                detalles.Add(new DetalleFactura
                {
                    PrendaId = prenda.Id,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = precioUnitario,
                    Subtotal = subtotalItem
                });

                prenda.Cantidad -= item.Cantidad;
                if (tipoOperacion == "alquiler")
                    prenda.Estado = "en alquiler";
                else if (prenda.Cantidad == 0)
                    prenda.Estado = "disponible";
            }

            var porcentajeIVA = _config.GetValue<decimal>("Facturacion:PorcentajeIVA", 19);
            var iva = Math.Round(subtotal * (porcentajeIVA / 100), 2);
            var total = subtotal + iva;

            var numeroFactura = await ObtenerSiguienteNumeroFacturaAsync();

            var factura = new Factura
            {
                NumeroFactura = numeroFactura,
                Fecha = DateTime.Now,
                ClienteId = cliente.Id,
                TipoOperacion = tipoOperacion,
                Subtotal = subtotal,
                IVA = iva,
                Total = total,
                Estado = "pagada",
                UsuarioId = usuario.Id,
                Detalles = detalles
            };

            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();

            _context.Pagos.Add(new Pago
            {
                Monto = total,
                FechaPago = DateTime.Now,
                MetodoPago = "Factura",
                FacturaId = factura.Id
            });
            await _context.SaveChangesAsync();

            return await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .Include(f => f.Detalles)
                    .ThenInclude(d => d.Prenda)
                .FirstAsync(f => f.Id == factura.Id);
        }

        private async Task<int> ObtenerSiguienteNumeroFacturaAsync()
        {
            var ultimo = await _context.Facturas
                .OrderByDescending(f => f.NumeroFactura)
                .Select(f => f.NumeroFactura)
                .FirstOrDefaultAsync();

            return ultimo + 1;
        }
    }
}
