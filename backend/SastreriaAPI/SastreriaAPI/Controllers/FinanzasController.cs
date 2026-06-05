using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;

namespace SastreriaAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FinanzasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FinanzasController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>Pedidos/órdenes de un cliente para registrar pagos.</summary>
        [HttpGet("pedidos-cliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetPedidosPorCliente(int clienteId)
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.PrendaCatalogo)
                .Where(p => p.ClienteId == clienteId && p.SaldoPendiente > 0)
                .OrderByDescending(p => p.FechaPedido)
                .Select(p => new
                {
                    p.Id,
                    p.FechaPedido,
                    Estilo = p.PrendaCatalogo != null ? p.PrendaCatalogo.Nombre : p.TipoPrenda,
                    p.CostoTotal,
                    p.SaldoPendiente,
                    p.Estado,
                    p.MetrosTela,
                    p.Observaciones
                })
                .ToListAsync();

            return pedidos;
        }
    }
}
