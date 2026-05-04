using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedidasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedidasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medida>>> GetMedidas()
        {
            return await _context.Medidas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Medida>> GetMedida(int id)
        {
            var medida = await _context.Medidas.FindAsync(id);

            if (medida == null)
                return NotFound();

            return medida;
        }

        [HttpPost]
        public async Task<ActionResult<Medida>> PostMedida(Medida medida)
        {
            _context.Medidas.Add(medida);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMedida), new { id = medida.Id }, medida);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedida(int id, Medida medida)
        {
            if (id != medida.Id)
                return BadRequest();

            _context.Entry(medida).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedida(int id)
        {
            var medida = await _context.Medidas.FindAsync(id);

            if (medida == null)
                return NotFound();

            _context.Medidas.Remove(medida);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}