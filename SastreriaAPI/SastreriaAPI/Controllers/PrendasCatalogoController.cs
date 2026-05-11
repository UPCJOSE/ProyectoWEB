using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
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
        public async Task<ActionResult<PrendaCatalogo>> PostPrenda([FromForm] PrendaCatalogoCreateDto dto)
        {
            string? imagenUrl = null;

            // Verificar si llegó una imagen
            if (dto.Imagen != null && dto.Imagen.Length > 0)
            {
                // Ruta física donde se guardarán las imágenes
                var uploadsFolder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads",
                    "prendas"
                );

                // Crear carpeta si no existe
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Crear nombre único para evitar conflictos
                var fileName = Guid.NewGuid().ToString() +
                               Path.GetExtension(dto.Imagen.FileName);

                // Ruta completa del archivo
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Guardar imagen físicamente
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Imagen.CopyToAsync(stream);
                }

                // Ruta que se guardará en la base de datos
                imagenUrl = $"/uploads/prendas/{fileName}";
            }

            // Crear objeto real para guardar en SQL
            var prenda = new PrendaCatalogo
            {
                Nombre = dto.Nombre,
                TipoPrenda = dto.TipoPrenda,
                PrecioBase = dto.PrecioBase,
                Activa = dto.Activa,
                ImagenUrl = imagenUrl
            };

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