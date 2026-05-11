using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EgresosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EgresosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Egreso>>> GetEgresos()
        {
            return await _context.Egresos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Egreso>> GetEgreso(int id)
        {
            var egreso = await _context.Egresos.FindAsync(id);

            if (egreso == null)
                return NotFound();

            return egreso;
        }

        [HttpPost]
        public async Task<ActionResult<Egreso>> PostEgreso(Egreso egreso)
        {
            _context.Egresos.Add(egreso);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEgreso), new { id = egreso.Id }, egreso);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEgreso(int id, Egreso egreso)
        {
            if (id != egreso.Id)
                return BadRequest();

            _context.Entry(egreso).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEgreso(int id)
        {
            var egreso = await _context.Egresos.FindAsync(id);

            if (egreso == null)
                return NotFound();

            _context.Egresos.Remove(egreso);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}