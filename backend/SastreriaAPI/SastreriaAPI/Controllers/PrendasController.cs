using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Authorize]
    [Route("api/prendas")]
    [ApiController]
    public class PrendasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrendasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrendaCatalogo>>> GetPrendas(
            [FromQuery] string? tipo,
            [FromQuery] string? estado,
            [FromQuery] string? talla)
        {
            var query = _context.PrendasCatalogo.AsQueryable();

            if (!string.IsNullOrWhiteSpace(tipo))
                query = query.Where(p => p.TipoPrenda == tipo);

            if (!string.IsNullOrWhiteSpace(estado))
                query = query.Where(p => p.Estado == estado);

            if (!string.IsNullOrWhiteSpace(talla))
                query = query.Where(p => p.Talla == talla);

            return await query.OrderBy(p => p.Nombre).ToListAsync();
        }

        [AllowAnonymous]
        [HttpGet("estilos")]
        public async Task<ActionResult<IEnumerable<object>>> GetEstilos()
        {
            return await _context.PrendasCatalogo
                .Where(p => p.Activa)
                .OrderBy(p => p.Nombre)
                .Select(p => new
                {
                    p.Id,
                    Estilo = p.Nombre,
                    p.TipoPrenda,
                    Costo = p.PrecioBase,
                    p.ConsumoTelaAprox,
                    p.ImagenUrl
                })
                .ToListAsync();
        }

        /// <summary>Catálogo de inventario visible para clientes (prendas con stock).</summary>
        [AllowAnonymous]
        [HttpGet("catalogo")]
        public async Task<ActionResult<IEnumerable<object>>> GetCatalogoInventario(
            [FromQuery] string? tipo,
            [FromQuery] string? talla)
        {
            var query = _context.PrendasCatalogo
                .Where(p => p.Activa && p.Cantidad > 0);

            if (!string.IsNullOrWhiteSpace(tipo))
                query = query.Where(p => p.TipoPrenda == tipo);

            if (!string.IsNullOrWhiteSpace(talla))
                query = query.Where(p => p.Talla == talla);

            return await query
                .OrderBy(p => p.TipoPrenda)
                .ThenBy(p => p.Nombre)
                .Select(p => new
                {
                    p.Id,
                    p.Nombre,
                    p.TipoPrenda,
                    p.Talla,
                    p.Color,
                    p.Cantidad,
                    p.Estado,
                    PrecioVenta = p.PrecioBase,
                    p.PrecioAlquiler,
                    p.ImagenUrl
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrendaCatalogo>> GetPrenda(int id)
        {
            var prenda = await _context.PrendasCatalogo.FindAsync(id);
            if (prenda == null)
                return NotFound();

            return prenda;
        }

        [HttpPost]
        public async Task<ActionResult<PrendaCatalogo>> PostPrenda(PrendaCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre) || string.IsNullOrWhiteSpace(dto.TipoPrenda))
                return BadRequest("Nombre y tipo de prenda son obligatorios.");

            var prenda = new PrendaCatalogo
            {
                Nombre = dto.Nombre,
                TipoPrenda = dto.TipoPrenda,
                Talla = dto.Talla,
                Color = dto.Color,
                Cantidad = dto.Cantidad,
                Estado = dto.Estado,
                PrecioBase = dto.PrecioVenta,
                PrecioAlquiler = dto.PrecioAlquiler,
                ConsumoTelaAprox = dto.ConsumoTelaAprox,
                Activa = dto.Activa,
                ImagenUrl = string.IsNullOrWhiteSpace(dto.ImagenUrl) ? null : dto.ImagenUrl.Trim()
            };

            _context.PrendasCatalogo.Add(prenda);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPrenda), new { id = prenda.Id }, prenda);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrenda(int id, PrendaCreateDto dto)
        {
            var prenda = await _context.PrendasCatalogo.FindAsync(id);
            if (prenda == null)
                return NotFound();

            prenda.Nombre = dto.Nombre;
            prenda.TipoPrenda = dto.TipoPrenda;
            prenda.Talla = dto.Talla;
            prenda.Color = dto.Color;
            prenda.Cantidad = dto.Cantidad;
            prenda.Estado = dto.Estado;
            prenda.PrecioBase = dto.PrecioVenta;
            prenda.PrecioAlquiler = dto.PrecioAlquiler;
            prenda.ConsumoTelaAprox = dto.ConsumoTelaAprox;
            prenda.Activa = dto.Activa;
            if (dto.ImagenUrl != null)
                prenda.ImagenUrl = string.IsNullOrWhiteSpace(dto.ImagenUrl) ? null : dto.ImagenUrl.Trim();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Administrador")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrenda(int id)
        {
            var prenda = await _context.PrendasCatalogo.FindAsync(id);
            if (prenda == null)
                return NotFound();

            _context.PrendasCatalogo.Remove(prenda);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
