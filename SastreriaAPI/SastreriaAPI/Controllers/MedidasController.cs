using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
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

        [HttpGet("cliente/{clienteId}")]
        public async Task<ActionResult<Medida>> GetMedidaByCliente(int clienteId)
        {
            // Busca la medida basándose en el ClienteId, no en el Id de la medida
            var medida = await _context.Medidas
                .FirstOrDefaultAsync(m => m.ClienteId == clienteId);

            if (medida == null)
            {
                return NotFound();
            }

            return medida;
        }

        // POST: api/Medidas
        [HttpPost]
        public async Task<ActionResult<Medida>> PostMedida(MedidaCreateDto dto)
        {
            var medida = new Medida
            {
                ClienteId = dto.ClienteId,

                Pecho = dto.Pecho,
                Cintura = dto.Cintura,
                Cadera = dto.Cadera,
                AltoCadera = dto.AltoCadera,
                Entrepierna = dto.Entrepierna,
                LargoTotal = dto.LargoTotal,
                AnchoBajo = dto.AnchoBajo,
                LargoBrazo = dto.LargoBrazo,
                Cuello = dto.Cuello,
                Hombros = dto.Hombros,
                LargoTalle = dto.LargoTalle,
                LargoTotalSuperior = dto.LargoTotalSuperior,

                UltimaMedida = dto.UltimaMedida
            };

            _context.Medidas.Add(medida);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetMedida),
                new { id = medida.Id },
                medida
            );
        }

        // PUT: api/Medidas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedida(int id, MedidaCreateDto dto)
        {
            var medida = await _context.Medidas.FindAsync(id);

            if (medida == null)
            {
                return NotFound();
            }

            medida.ClienteId = dto.ClienteId;

            medida.Pecho = dto.Pecho;
            medida.Cintura = dto.Cintura;
            medida.Cadera = dto.Cadera;
            medida.AltoCadera = dto.AltoCadera;
            medida.Entrepierna = dto.Entrepierna;
            medida.LargoTotal = dto.LargoTotal;
            medida.AnchoBajo = dto.AnchoBajo;
            medida.LargoBrazo = dto.LargoBrazo;
            medida.Cuello = dto.Cuello;
            medida.Hombros = dto.Hombros;
            medida.LargoTalle = dto.LargoTalle;
            medida.LargoTotalSuperior = dto.LargoTotalSuperior;

            medida.UltimaMedida = dto.UltimaMedida;

            await _context.SaveChangesAsync();

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