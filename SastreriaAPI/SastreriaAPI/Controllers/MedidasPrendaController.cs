using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedidasPrendaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedidasPrendaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/MedidasPrenda
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedidaPrenda>>> GetMedidasPrenda()
        {
            return await _context.MedidasPrenda
                .Include(m => m.Cliente)
                .Include(m => m.PrendaCatalogo)
                .ToListAsync();
        }

        // GET: api/MedidasPrenda/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedidaPrenda>> GetMedidaPrenda(int id)
        {
            var medidaPrenda = await _context.MedidasPrenda
                .Include(m => m.Cliente)
                .Include(m => m.PrendaCatalogo)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (medidaPrenda == null)
            {
                return NotFound();
            }

            return medidaPrenda;
        }

        // POST: api/MedidasPrenda
        [HttpPost]
        public async Task<ActionResult<MedidaPrenda>> PostMedidaPrenda(MedidaPrendaCreateDto dto)
        {
            var medidaPrenda = new MedidaPrenda
            {
                ClienteId = dto.ClienteId,
                PrendaCatalogoId = dto.PrendaCatalogoId,

                AjustePecho = dto.AjustePecho,
                AjusteCintura = dto.AjusteCintura,
                AjusteCadera = dto.AjusteCadera,
                LargoEspecial = dto.LargoEspecial,
                AnchoBota = dto.AnchoBota
            };

            _context.MedidasPrenda.Add(medidaPrenda);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetMedidaPrenda),
                new { id = medidaPrenda.Id },
                medidaPrenda
            );
        }

        // PUT: api/MedidasPrenda/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedidaPrenda(int id, MedidaPrendaCreateDto dto)
        {
            var medidaPrenda = await _context.MedidasPrenda.FindAsync(id);

            if (medidaPrenda == null)
            {
                return NotFound();
            }

            medidaPrenda.ClienteId = dto.ClienteId;
            medidaPrenda.PrendaCatalogoId = dto.PrendaCatalogoId;

            medidaPrenda.AjustePecho = dto.AjustePecho;
            medidaPrenda.AjusteCintura = dto.AjusteCintura;
            medidaPrenda.AjusteCadera = dto.AjusteCadera;
            medidaPrenda.LargoEspecial = dto.LargoEspecial;
            medidaPrenda.AnchoBota = dto.AnchoBota;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/MedidasPrenda/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedidaPrenda(int id)
        {
            var medidaPrenda = await _context.MedidasPrenda.FindAsync(id);

            if (medidaPrenda == null)
            {
                return NotFound();
            }

            _context.MedidasPrenda.Remove(medidaPrenda);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}