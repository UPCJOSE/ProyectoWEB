using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;
using BCrypt.Net;

namespace SastreriaAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            return usuario;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            if (!string.IsNullOrEmpty(usuario.Password))
            {
                usuario.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
            }

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
                return BadRequest();

            _context.Entry(usuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // En caso de que se necesite migrar contraseñas no hasheadas a bcrypt, se puede usar este método. Se recomienda eliminarlo después de su uso para evitar riesgos
        /*[AllowAnonymous] 
        [HttpPost("migrar")]
        public async Task<IActionResult> MigrarPasswords()
        {
            var usuarios = await _context.Usuarios.ToListAsync();
            int actualizados = 0;

            foreach (var usuario in usuarios)
            {
                if (!string.IsNullOrEmpty(usuario.Password) && !usuario.Password.StartsWith("$"))
                {
                    usuario.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
                    actualizados++;
                }
            }

            if (actualizados > 0)
            {
                await _context.SaveChangesAsync();
            }

            return Ok(new { Mensaje = $"Proceso terminado" });
        }*/
    }
}