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
    [Route("api/ordenes")]
    [ApiController]
    public class OrdenesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdenesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetOrdenes(
            [FromQuery] string? estado,
            [FromQuery] int? sastreId)
        {
            var query = _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.Sastre)
                .Include(p => p.PrendaCatalogo)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(estado))
                query = query.Where(p => p.Estado == estado);

            if (sastreId.HasValue)
                query = query.Where(p => p.SastreId == sastreId);

            return await query
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pedido>> GetOrden(int id)
        {
            var orden = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.Sastre)
                .Include(p => p.PrendaCatalogo)
                .Include(p => p.MedidaPrenda)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (orden == null)
                return NotFound();

            return orden;
        }

        [HttpPost]
        public async Task<ActionResult<Pedido>> PostOrden(OrdenCreateDto dto)
        {
            decimal precioUnitario = 0;
            var tipoPrenda = dto.TipoPrenda;
            var consumoTela = dto.ConsumoTela;

            if (dto.PrendaCatalogoId.HasValue)
            {
                var estilo = await _context.PrendasCatalogo.FindAsync(dto.PrendaCatalogoId);
                if (estilo == null)
                    return BadRequest("Estilo de prenda no encontrado.");

                tipoPrenda = estilo.TipoPrenda;
                precioUnitario = estilo.PrecioBase;
                if (consumoTela <= 0)
                    consumoTela = estilo.ConsumoTelaAprox;
            }

            if (string.IsNullOrWhiteSpace(tipoPrenda))
                return BadRequest("Seleccione un estilo de prenda.");

            var (medidasOk, medidasError) = await PedidoReglas.ValidarMedidasClienteAsync(_context, dto.ClienteId);
            if (!medidasOk)
                return BadRequest(medidasError);

            if (PedidoReglas.RequiereMedidasParaEstado(dto.Estado) && !medidasOk)
                return BadRequest(medidasError);

            var orden = new Pedido
            {
                ClienteId = dto.ClienteId,
                PrendaCatalogoId = dto.PrendaCatalogoId,
                MedidaPrendaId = dto.MedidaPrendaId,
                MetrosTela = dto.MetrosTela,
                TipoPrenda = tipoPrenda,
                ConsumoTela = consumoTela,
                CantidadBotones = dto.CantidadBotones,
                TipoBoton = dto.TipoBoton,
                Observaciones = dto.Observaciones,
                SastreId = dto.SastreId,
                PrecioUnitario = precioUnitario,
                CostoTotal = precioUnitario,
                SaldoPendiente = precioUnitario,
                Estado = dto.Estado,
                FechaEntrega = dto.FechaEntrega
            };

            _context.Pedidos.Add(orden);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrden), new { id = orden.Id }, orden);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrden(int id, OrdenCreateDto dto)
        {
            var orden = await _context.Pedidos.FindAsync(id);
            if (orden == null)
                return NotFound();

            if (PedidoReglas.RequiereMedidasParaEstado(dto.Estado))
            {
                var (medidasOk, medidasError) = await PedidoReglas.ValidarMedidasClienteAsync(_context, dto.ClienteId);
                if (!medidasOk)
                    return BadRequest(medidasError);
            }

            if (PedidoReglas.RequiereTelaCompletaParaEstado(dto.Estado))
            {
                var (telaOk, telaError) = PedidoReglas.ValidarTelaSuficiente(orden.MetrosTela, orden.ConsumoTela);
                if (!telaOk)
                    return BadRequest(telaError);
            }

            var tipoPrenda = dto.TipoPrenda;
            var consumoTela = dto.ConsumoTela;
            decimal precioUnitario = orden.PrecioUnitario;

            if (dto.PrendaCatalogoId.HasValue)
            {
                var estilo = await _context.PrendasCatalogo.FindAsync(dto.PrendaCatalogoId);
                if (estilo != null)
                {
                    tipoPrenda = estilo.TipoPrenda;
                    precioUnitario = estilo.PrecioBase;
                    if (consumoTela <= 0)
                        consumoTela = estilo.ConsumoTelaAprox;
                }
            }

            orden.ClienteId = dto.ClienteId;
            orden.PrendaCatalogoId = dto.PrendaCatalogoId;
            orden.MedidaPrendaId = dto.MedidaPrendaId;
            orden.MetrosTela = dto.MetrosTela;
            orden.TipoPrenda = tipoPrenda;
            orden.ConsumoTela = consumoTela;
            orden.CantidadBotones = dto.CantidadBotones;
            orden.TipoBoton = dto.TipoBoton;
            orden.Observaciones = dto.Observaciones;
            orden.SastreId = dto.SastreId;
            orden.Estado = dto.Estado;
            orden.FechaEntrega = dto.FechaEntrega;
            orden.PrecioUnitario = precioUnitario;
            orden.CostoTotal = precioUnitario;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
