using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;

namespace SastreriaAPI.Services
{
    public static class PedidoReglas
    {
        private static readonly HashSet<string> EstadosAvanzados = new(StringComparer.OrdinalIgnoreCase)
        {
            "en proceso", "terminada", "entregada",
            "En proceso", "Terminado", "Entregado"
        };

        private static readonly HashSet<string> EstadosInicioConfeccion = new(StringComparer.OrdinalIgnoreCase)
        {
            "en proceso", "En proceso"
        };

        private static readonly HashSet<string> EstadosEntrega = new(StringComparer.OrdinalIgnoreCase)
        {
            "entregada", "Entregado"
        };

        public static bool RequiereMedidasParaEstado(string? estado) =>
            !string.IsNullOrWhiteSpace(estado) && EstadosAvanzados.Contains(estado.Trim());

        public static bool RequiereTelaCompletaParaEstado(string? estado) =>
            !string.IsNullOrWhiteSpace(estado) &&
            (EstadosInicioConfeccion.Contains(estado.Trim()) ||
             EstadosEntrega.Contains(estado.Trim()));

        public static (bool Ok, string? Error) ValidarTelaSuficiente(decimal metrosTela, decimal consumoTela)
        {
            if (consumoTela <= 0)
                return (false, "La orden no tiene definido el consumo de tela requerido.");

            if (metrosTela < consumoTela)
            {
                return (false,
                    $"Falta tela. El cliente trajo {metrosTela:0.##} m y se requieren {consumoTela:0.##} m para continuar.");
            }

            return (true, null);
        }

        public static async Task<(bool Ok, string? Error)> ValidarMedidasClienteAsync(
            ApplicationDbContext context, int clienteId)
        {
            var tieneMedidas = await context.Medidas.AnyAsync(m => m.ClienteId == clienteId);
            if (!tieneMedidas)
            {
                return (false,
                    "El cliente no tiene medidas registradas. Regístrelas en Recepción → Medidas antes de continuar.");
            }

            return (true, null);
        }
    }
}
