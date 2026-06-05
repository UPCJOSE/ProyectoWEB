using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

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

        [Authorize(Roles = "Administrador")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsuarios()
        {
            return await _context.Usuarios
                .Select(u => new
                {
                    u.Id,
                    u.Nombre,
                    u.Correo,
                    Rol = u.Rol.ToString(),
                    RolId = (int)u.Rol,
                    u.Activo
                })
                .ToListAsync();
        }

        [Authorize(Roles = "Administrador,Recepcionista,Sastre")]
        [HttpGet("sastres")]
        public async Task<ActionResult<IEnumerable<object>>> GetSastres()
        {
            return await _context.Usuarios
                .Where(u => u.Rol == Rol.Sastre && u.Activo)
                .Select(u => new { u.Id, u.Nombre })
                .ToListAsync();
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();

            return new
            {
                usuario.Id,
                usuario.Nombre,
                usuario.Correo,
                Rol = usuario.Rol.ToString(),
                RolId = (int)usuario.Rol,
                usuario.Activo
            };
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<object>> PostUsuario(Usuario usuario)
        {
            if (!string.IsNullOrEmpty(usuario.Password))
                usuario.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);

            usuario.Activo = true;
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, new
            {
                usuario.Id,
                usuario.Nombre,
                usuario.Correo,
                Rol = usuario.Rol.ToString(),
                usuario.Activo
            });
        }

        [Authorize(Roles = "Administrador")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
                return BadRequest();

            var existente = await _context.Usuarios.FindAsync(id);
            if (existente == null)
                return NotFound();

            existente.Nombre = usuario.Nombre;
            existente.Correo = usuario.Correo;
            existente.Rol = usuario.Rol;
            existente.Activo = usuario.Activo;

            if (!string.IsNullOrWhiteSpace(usuario.Password))
            {
                existente.Password = usuario.Password.StartsWith("$")
                    ? usuario.Password
                    : BCrypt.Net.BCrypt.HashPassword(usuario.Password);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Administrador")]
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
    }
}
