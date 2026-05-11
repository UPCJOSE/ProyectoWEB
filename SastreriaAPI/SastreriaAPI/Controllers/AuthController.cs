using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.Models;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            if (!Enum.TryParse<Rol>(login.Rol, true, out var rolEnum))
            {
                return BadRequest("Rol inválido");
            }

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u =>
                u.Correo == login.Correo &&
                u.Password == login.Password &&
                u.Rol == rolEnum);

            if (usuario == null)
            {
                return Unauthorized("Credenciales incorrectas");
            }

            return Ok(new
            {
                usuario.Id,
                usuario.Nombre,
                usuario.Correo,
                Rol = usuario.Rol.ToString()
            });
        }
    }
}