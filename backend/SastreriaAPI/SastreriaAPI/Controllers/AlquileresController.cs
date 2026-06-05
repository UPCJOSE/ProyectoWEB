using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.DTOs;
using SastreriaAPI.Services;
using System.Security.Claims;

namespace SastreriaAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AlquileresController : ControllerBase
    {
        private readonly FacturaService _facturaService;
        private readonly ApplicationDbContext _context;

        public AlquileresController(FacturaService facturaService, ApplicationDbContext context)
        {
            _facturaService = facturaService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CrearAlquiler([FromBody] AlquilerCreateDto dto)
        {
            var usuarioId = await ObtenerUsuarioIdAsync();
            if (usuarioId == null)
                return Unauthorized("Usuario no identificado.");

            try
            {
                var factura = await _facturaService.CrearFacturaAsync(
                    dto.ClienteId,
                    usuarioId.Value,
                    "alquiler",
                    dto.Items,
                    prenda => prenda.PrecioAlquiler > 0 ? prenda.PrecioAlquiler : prenda.PrecioBase);

                return CreatedAtAction(
                    nameof(FacturasController.GetFactura),
                    "Facturas",
                    new { id = factura.Id },
                    factura);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private async Task<int?> ObtenerUsuarioIdAsync()
        {
            var correo = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(correo))
                return null;

            var usuario = await _context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Correo == correo);

            return usuario?.Id;
        }
    }
}
