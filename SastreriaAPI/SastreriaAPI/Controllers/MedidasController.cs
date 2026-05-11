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

        // GET: api/Medidas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medida>>> GetMedidas()
        {
            return await _context.Medidas
                .Include(m => m.Cliente)
                .ToListAsync();
        }

        // GET: api/Medidas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Medida>> GetMedida(int id)
        {
            var medida = await _context.Medidas
                .Include(m => m.Cliente)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (medida == null)
            {
                return NotFound();
            }

            return medida;
        }

        // GET: api/Medidas/Cliente/1
        [HttpGet("Cliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<Medida>>> GetMedidasPorCliente(int clienteId)
        {
            var medidas = await _context.Medidas
                .Where(m => m.ClienteId == clienteId)
                .OrderByDescending(m => m.FechaRegistro)
                .ToListAsync();

            return medidas;
        }

        // POST: api/Medidas
        [HttpPost]
        public async Task<ActionResult<Medida>> PostMedida(Medida medida)
        {
            var clienteExiste = await _context.Clientes
                .AnyAsync(c => c.Id == medida.ClienteId);

            if (!clienteExiste)
            {
                return BadRequest("El cliente no existe.");
            }

            medida.FechaRegistro = DateTime.Now;

            _context.Medidas.Add(medida);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMedida), new { id = medida.Id }, medida);
        }

        // PUT: api/Medidas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedida(int id, Medida medida)
        {
            if (id != medida.Id)
            {
                return BadRequest();
            }

            _context.Entry(medida).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Medidas.Any(e => e.Id == id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // DELETE: api/Medidas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedida(int id)
        {
            var medida = await _context.Medidas.FindAsync(id);

            if (medida == null)
            {
                return NotFound();
            }

            _context.Medidas.Remove(medida);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}