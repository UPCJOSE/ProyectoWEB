using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrendasCatalogoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrendasCatalogoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PrendasCatalogo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrendaCatalogo>>> GetPrendas()
        {
            return await _context.PrendasCatalogo.ToListAsync();
        }

        // GET: api/PrendasCatalogo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PrendaCatalogo>> GetPrenda(int id)
        {
            var prenda = await _context.PrendasCatalogo.FindAsync(id);

            if (prenda == null)
            {
                return NotFound();
            }

            return prenda;
        }

        // POST: api/PrendasCatalogo
        [HttpPost]
        public async Task<ActionResult<PrendaCatalogo>> PostPrenda(PrendaCatalogo prenda)
        {
            _context.PrendasCatalogo.Add(prenda);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPrenda), new { id = prenda.Id }, prenda);
        }

        // PUT: api/PrendasCatalogo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrenda(int id, PrendaCatalogo prenda)
        {
            if (id != prenda.Id)
            {
                return BadRequest();
            }

            _context.Entry(prenda).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.PrendasCatalogo.Any(e => e.Id == id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // DELETE: api/PrendasCatalogo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrenda(int id)
        {
            var prenda = await _context.PrendasCatalogo.FindAsync(id);

            if (prenda == null)
            {
                return NotFound();
            }

            _context.PrendasCatalogo.Remove(prenda);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}