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
    public class PagosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PagosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPagos()
        {
            return await _context.Pagos
                .Include(p => p.Pedido)
                    .ThenInclude(p => p!.Cliente)
                .Include(p => p.Pedido)
                    .ThenInclude(p => p!.PrendaCatalogo)
                .Include(p => p.Factura)
                    .ThenInclude(f => f!.Cliente)
                .OrderByDescending(p => p.FechaPago)
                .Select(p => new
                {
                    p.Id,
                    p.Monto,
                    p.FechaPago,
                    p.MetodoPago,
                    p.PedidoId,
                    p.FacturaId,
                    p.Referencia,
                    ClienteNombre = p.Pedido != null && p.Pedido.Cliente != null
                        ? p.Pedido.Cliente.Nombre
                        : p.Factura != null && p.Factura.Cliente != null
                            ? p.Factura.Cliente.Nombre
                            : null,
                    ReferenciaTexto = p.Referencia != null
                        ? p.Referencia
                        : p.PedidoId.HasValue
                            ? $"ORD-{p.PedidoId}"
                            : p.FacturaId.HasValue
                                ? $"FAC-{p.Factura!.NumeroFactura:D4}"
                                : "—"
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pago>> GetPago(int id)
        {
            var pago = await _context.Pagos.FindAsync(id);
            if (pago == null)
                return NotFound();

            return pago;
        }

        [HttpPost]
        public async Task<ActionResult<Pago>> PostPago(Pago pago)
        {
            if (pago.Monto <= 0)
                return BadRequest("El monto debe ser mayor a cero.");

            if (!pago.PedidoId.HasValue && !pago.FacturaId.HasValue)
                return BadRequest("Debe indicar un pedido o una factura.");

            Pedido? pedido = null;

            if (pago.PedidoId.HasValue)
            {
                pedido = await _context.Pedidos.FindAsync(pago.PedidoId.Value);
                if (pedido == null)
                    return BadRequest("Pedido no encontrado.");

                if (pago.Monto > pedido.SaldoPendiente)
                    return BadRequest($"El monto supera el saldo pendiente ({pedido.SaldoPendiente:C0}).");

                pago.Referencia ??= $"ORD-{pedido.Id}";
                pedido.SaldoPendiente = Math.Max(0, pedido.SaldoPendiente - pago.Monto);
            }

            if (pago.FacturaId.HasValue)
            {
                var factura = await _context.Facturas.FindAsync(pago.FacturaId.Value);
                if (factura == null)
                    return BadRequest("Factura no encontrada.");

                factura.Estado = "pagada";
                pago.Referencia ??= $"FAC-{factura.NumeroFactura:D4}";
            }

            if (pago.FechaPago == default)
                pago.FechaPago = DateTime.Now;

            _context.Pagos.Add(pago);

            if (pedido != null && pedido.SaldoPendiente <= 0)
                pedido.Estado = "entregada";

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPago), new { id = pago.Id }, pago);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPago(int id, Pago pago)
        {
            if (id != pago.Id)
                return BadRequest();

            _context.Entry(pago).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
