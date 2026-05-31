using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.JWT;

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
                .FirstOrDefaultAsync(u => u.Correo == loginDto.Email && u.Password == loginDto.Password);

            if (usuario == null) return Unauthorized("Credenciales inválidas");

            var token = _jwtGenerador.GenerateToken(usuario.Correo);

            return Ok(new
            {
                token,
                usuario.Id,
                usuario.Nombre,
                usuario.Correo,
                rol = new
                {
                    nombre = usuario.Rol.ToString()
                }
            });
        }
    }
}
