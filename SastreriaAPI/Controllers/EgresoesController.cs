using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EgresoesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EgresoesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Egresoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Egreso>>> GetEgresos()
        {
            return await _context.Egresos.ToListAsync();
        }

        // GET: api/Egresoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Egreso>> GetEgreso(int id)
        {
            var egreso = await _context.Egresos.FindAsync(id);

            if (egreso == null)
            {
                return NotFound();
            }

            return egreso;
        }

        // PUT: api/Egresoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEgreso(int id, Egreso egreso)
        {
            if (id != egreso.Id)
            {
                return BadRequest();
            }

            _context.Entry(egreso).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EgresoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Egresoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Egreso>> PostEgreso(Egreso egreso)
        {
            _context.Egresos.Add(egreso);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEgreso", new { id = egreso.Id }, egreso);
        }

        // DELETE: api/Egresoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEgreso(int id)
        {
            var egreso = await _context.Egresos.FindAsync(id);
            if (egreso == null)
            {
                return NotFound();
            }

            _context.Egresos.Remove(egreso);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EgresoExists(int id)
        {
            return _context.Egresos.Any(e => e.Id == id);
        }
    }
}
