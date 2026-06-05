using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.Models;
using SastreriaAPI.Services;

namespace SastreriaAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PedidosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
        {
            try
            {
                return await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.PrendaCatalogo)
                .Include(p => p.MedidaPrenda)
                .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
            
        }

        // GET by id
        [HttpGet("{id}")]
        public async Task<ActionResult<Pedido>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.PrendaCatalogo)
                .Include(p => p.MedidaPrenda)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
            {
                return NotFound();
            }

            return pedido;
        }

        // POST
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(PedidoCreateDto dto)
        {
            var prenda = await _context.PrendasCatalogo
                .FindAsync(dto.PrendaCatalogoId);

            if (prenda == null)
            {
                return BadRequest("Prenda no encontrada");
            }

            var (medidasOk, medidasError) = await PedidoReglas.ValidarMedidasClienteAsync(_context, dto.ClienteId);
            if (!medidasOk)
                return BadRequest(medidasError);

            if (PedidoReglas.RequiereMedidasParaEstado(dto.Estado) && !medidasOk)
                return BadRequest(medidasError);

            var costo = dto.CostoTotal > 0 ? dto.CostoTotal : prenda.PrecioBase;
            var saldo = dto.SaldoPendiente > 0 ? dto.SaldoPendiente : costo;

            var pedido = new Pedido
            {
                ClienteId = dto.ClienteId,
                PrendaCatalogoId = dto.PrendaCatalogoId,
                MedidaPrendaId = dto.MedidaPrendaId,
                TipoPrenda = prenda.TipoPrenda,
                ConsumoTela = prenda.ConsumoTelaAprox,
                MetrosTela = dto.MetrosTela,
                PrecioUnitario = prenda.PrecioBase,
                CostoTotal = costo,
                SaldoPendiente = saldo,
                Estado = dto.Estado,
                FechaEntrega = dto.FechaEntrega
            };

            _context.Pedidos.Add(pedido);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPedido),
                new { id = pedido.Id },
                pedido);
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedido(int id, PedidoCreateDto dto)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

            if (pedido == null)
            {
                return NotFound();
            }

            if (PedidoReglas.RequiereMedidasParaEstado(dto.Estado))
            {
                var (medidasOk, medidasError) = await PedidoReglas.ValidarMedidasClienteAsync(_context, dto.ClienteId);
                if (!medidasOk)
                    return BadRequest(medidasError);
            }

            if (PedidoReglas.RequiereTelaCompletaParaEstado(dto.Estado))
            {
                var (telaOk, telaError) = PedidoReglas.ValidarTelaSuficiente(pedido.MetrosTela, pedido.ConsumoTela);
                if (!telaOk)
                    return BadRequest(telaError);
            }

            pedido.ClienteId = dto.ClienteId;
            pedido.PrendaCatalogoId = dto.PrendaCatalogoId;
            pedido.MedidaPrendaId = dto.MedidaPrendaId;
            pedido.CostoTotal = dto.CostoTotal;
            pedido.SaldoPendiente = dto.SaldoPendiente;
            pedido.Estado = dto.Estado;
            pedido.FechaEntrega = dto.FechaEntrega;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
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