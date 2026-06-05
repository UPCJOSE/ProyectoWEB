using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.JWT;
using BCrypt.Net;

namespace SastreriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenGenerador _jwtGenerador;

        public AuthController(ApplicationDbContext context, JwtTokenGenerador jwtGenerador)
        {
            _context = context;
            _jwtGenerador = jwtGenerador;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == loginDto.Email);

            if (usuario == null) return Unauthorized("Credenciales inválidas");

            bool passencryp = BCrypt.Net.BCrypt.Verify(loginDto.Password, usuario.Password);

            if (!passencryp) return Unauthorized("Credenciales inválidas");

            if (!usuario.Activo)
                return Unauthorized("Usuario inactivo. Contacte al administrador.");

            var token = _jwtGenerador.GenerateToken(usuario);

            return Ok(new
            {
                token,
                usuario.Id,
                usuario.Nombre,
                usuario.Correo,
                usuario.Activo,
                rol = new
                {
                    id = (int)usuario.Rol,
                    nombre = usuario.Rol.ToString()
                }
            });
        }
    }
}
