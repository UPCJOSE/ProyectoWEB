using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FacturasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetFacturas(
            [FromQuery] string? tipo,
            [FromQuery] string? estado)
        {
            var query = _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .Include(f => f.Detalles)
                    .ThenInclude(d => d.Prenda)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(tipo))
                query = query.Where(f => f.TipoOperacion == tipo);

            if (!string.IsNullOrWhiteSpace(estado))
                query = query.Where(f => f.Estado == estado);

            var facturas = await query
                .OrderByDescending(f => f.Fecha)
                .ToListAsync();

            var facturaIds = facturas.Select(f => f.Id).ToList();
            var pagosPorFactura = await _context.Pagos
                .Where(p => p.FacturaId != null && facturaIds.Contains(p.FacturaId.Value))
                .GroupBy(p => p.FacturaId)
                .Select(g => new { FacturaId = g.Key, TotalPagado = g.Sum(p => p.Monto) })
                .ToDictionaryAsync(x => x.FacturaId!.Value, x => x.TotalPagado);

            var resultado = facturas.Select(f => new
            {
                f.Id,
                f.NumeroFactura,
                f.Fecha,
                f.ClienteId,
                Cliente = f.Cliente,
                f.TipoOperacion,
                f.Subtotal,
                f.IVA,
                f.Total,
                f.Estado,
                f.UsuarioId,
                Usuario = f.Usuario,
                f.Detalles,
                IngresoRegistrado = pagosPorFactura.ContainsKey(f.Id),
                TotalPagado = pagosPorFactura.GetValueOrDefault(f.Id, 0)
            });

            return Ok(resultado);
        }

        /// <summary>Órdenes de confección con estado de pago y tela.</summary>
        [HttpGet("ordenes-cuentas")]
        public async Task<ActionResult<IEnumerable<object>>> GetOrdenesCuentas()
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.PrendaCatalogo)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();

            var pedidoIds = pedidos.Select(p => p.Id).ToList();
            var pagosPorPedido = await _context.Pagos
                .Where(p => p.PedidoId != null && pedidoIds.Contains(p.PedidoId.Value))
                .GroupBy(p => p.PedidoId)
                .Select(g => new { PedidoId = g.Key, TotalPagado = g.Sum(p => p.Monto) })
                .ToDictionaryAsync(x => x.PedidoId!.Value, x => x.TotalPagado);

            return pedidos.Select(p =>
            {
                var pagado = pagosPorPedido.GetValueOrDefault(p.Id, 0);
                var sinTela = p.MetrosTela <= 0;
                string estadoCuenta;
                if (p.SaldoPendiente <= 0 || pagado >= p.CostoTotal)
                    estadoCuenta = "pagado";
                else if (pagado > 0)
                    estadoCuenta = "abono";
                else
                    estadoCuenta = "pendiente";

                return new
                {
                    p.Id,
                    p.FechaPedido,
                    Cliente = p.Cliente,
                    Estilo = p.PrendaCatalogo?.Nombre ?? p.TipoPrenda,
                    p.CostoTotal,
                    p.SaldoPendiente,
                    TotalPagado = pagado,
                    EstadoCuenta = estadoCuenta,
                    p.Estado,
                    p.MetrosTela,
                    p.Observaciones,
                    SinTela = sinTela,
                    Alerta = sinTela
                        ? (string.IsNullOrWhiteSpace(p.Observaciones)
                            ? "Cliente aún no trae tela"
                            : p.Observaciones)
                        : null
                };
            }).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> GetFactura(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .Include(f => f.Detalles)
                    .ThenInclude(d => d.Prenda)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (factura == null)
                return NotFound();

            return factura;
        }
    }
}
