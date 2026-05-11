using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PedidosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Pedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
        {
            return await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.PrendaCatalogo)
                .Include(p => p.Medida)
                .ToListAsync();
        }

        // GET: api/Pedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pedido>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.PrendaCatalogo)
                .Include(p => p.Medida)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
            {
                return NotFound();
            }

            return pedido;
        }

        // POST: api/Pedidos
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
        {
            // Validar cliente
            var clienteExiste = await _context.Clientes
                .AnyAsync(c => c.Id == pedido.ClienteId);

            if (!clienteExiste)
            {
                return BadRequest("El cliente no existe.");
            }

            // Buscar prenda
            var prenda = await _context.PrendasCatalogo
                .FirstOrDefaultAsync(p => p.Id == pedido.PrendaCatalogoId);

            if (prenda == null)
            {
                return BadRequest("La prenda no existe.");
            }

            // Validar medida si viene
            if (pedido.MedidaId.HasValue)
            {
                var medidaExiste = await _context.Medidas
                    .AnyAsync(m => m.Id == pedido.MedidaId.Value);

                if (!medidaExiste)
                {
                    return BadRequest("La medida no existe.");
                }
            }

            // Copiar precio del catálogo
            pedido.PrecioUnitario = prenda.PrecioBase;

            // Calcular saldo
            pedido.SaldoPendiente = pedido.CostoTotal;

            // Fecha automática
            pedido.FechaPedido = DateTime.Now;

            _context.Pedidos.Add(pedido);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPedido), new { id = pedido.Id }, pedido);
        }

        // PUT: api/Pedidos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedido(int id, Pedido pedido)
        {
            if (id != pedido.Id)
            {
                return BadRequest();
            }

            _context.Entry(pedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Pedidos.Any(e => e.Id == id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // DELETE: api/Pedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

            if (pedido == null)
            {
                return NotFound();
            }

            _context.Pedidos.Remove(pedido);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}