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
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == loginDto.Email && u.Password == loginDto.Password);

            if (usuario == null) return Unauthorized("Credenciales inválidas");

            return Ok(new
            {
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