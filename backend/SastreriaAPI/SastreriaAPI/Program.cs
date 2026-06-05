using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SastreriaAPI.Data;
using SastreriaAPI.JWT;
using SastreriaAPI.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Servicios
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173"
            )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<JwtTokenGenerador>();
builder.Services.AddScoped<SastreriaAPI.Services.FacturaService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            RoleClaimType = System.Security.Claims.ClaimTypes.Role,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]!))
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    if (!context.Usuarios.Any())
    {
        context.Usuarios.AddRange(
            new Usuario
            {
                Nombre = "Administrador",
                Correo = "admin@sastreria.com",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                Rol = Rol.Administrador,
                Activo = true
            },
            new Usuario
            {
                Nombre = "Recepcionista",
                Correo = "recepcion@sastreria.com",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                Rol = Rol.Recepcionista,
                Activo = true
            },
            new Usuario
            {
                Nombre = "Sastre",
                Correo = "sastre@sastreria.com",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                Rol = Rol.Sastre,
                Activo = true
            },
            new Usuario
            {
                Nombre = "Cliente",
                Correo = "cliente@sastreria.com",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                Rol = Rol.Cliente,
                Activo = true
            }
        );

        context.SaveChanges();
    }

    // Hashear contraseñas demo si quedaron en texto plano
    var usuariosSinHash = context.Usuarios
        .Where(u => !u.Password.StartsWith("$"))
        .ToList();

    foreach (var u in usuariosSinHash)
    {
        u.Password = BCrypt.Net.BCrypt.HashPassword(u.Password);
        if (!context.Entry(u).Property(x => x.Activo).IsModified)
            u.Activo = true;
    }

    if (usuariosSinHash.Count > 0)
        context.SaveChanges();

    const string demoMarker = "CAM-001 Camiseta básica algodón";
    if (!context.PrendasCatalogo.Any(p => p.Nombre == demoMarker))
    {
        context.PrendasCatalogo.AddRange(
            // Camisetas / camisas
            new PrendaCatalogo
            {
                Nombre = "CAM-001 Camiseta básica algodón",
                TipoPrenda = "Camisa",
                Talla = "M",
                Color = "Blanco",
                Cantidad = 18,
                Estado = "disponible",
                PrecioBase = 45000,
                PrecioAlquiler = 12000,
                ConsumoTelaAprox = 1.2m,
                ImagenUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
            },
            new PrendaCatalogo
            {
                Nombre = "CAM-002 Camiseta polo clásica",
                TipoPrenda = "Camisa",
                Talla = "L",
                Color = "Azul marino",
                Cantidad = 12,
                Estado = "disponible",
                PrecioBase = 52000,
                PrecioAlquiler = 15000,
                ConsumoTelaAprox = 1.3m,
                ImagenUrl = "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400"
            },
            new PrendaCatalogo
            {
                Nombre = "CAM-003 Camisa formal oxford",
                TipoPrenda = "Camisa",
                Talla = "M",
                Color = "Blanco",
                Cantidad = 8,
                Estado = "disponible",
                PrecioBase = 118000,
                PrecioAlquiler = 32000,
                ConsumoTelaAprox = 2.0m,
                ImagenUrl = "https://images.unsplash.com/photo-1596755094514-f87e34085b56?w=400"
            },
            // Pantalones
            new PrendaCatalogo
            {
                Nombre = "PAN-001 Pantalón vestir slim",
                TipoPrenda = "Pantalón",
                Talla = "32",
                Color = "Gris",
                Cantidad = 7,
                Estado = "disponible",
                PrecioBase = 185000,
                PrecioAlquiler = 48000,
                ConsumoTelaAprox = 1.8m,
                ImagenUrl = "https://images.unsplash.com/photo-1473966968600-fa801b279a0?w=400"
            },
            new PrendaCatalogo
            {
                Nombre = "PAN-002 Jean clásico recto",
                TipoPrenda = "Pantalón",
                Talla = "30",
                Color = "Azul oscuro",
                Cantidad = 14,
                Estado = "disponible",
                PrecioBase = 98000,
                PrecioAlquiler = 28000,
                ConsumoTelaAprox = 1.6m,
                ImagenUrl = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
            },
            new PrendaCatalogo
            {
                Nombre = "PAN-003 Pantalón chino",
                TipoPrenda = "Pantalón",
                Talla = "M",
                Color = "Beige",
                Cantidad = 9,
                Estado = "en alquiler",
                PrecioBase = 89000,
                PrecioAlquiler = 25000,
                ConsumoTelaAprox = 1.7m,
                ImagenUrl = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400"
            },
            // Faldas
            new PrendaCatalogo
            {
                Nombre = "FAL-001 Falda plisada",
                TipoPrenda = "Falda",
                Talla = "S",
                Color = "Negro",
                Cantidad = 10,
                Estado = "disponible",
                PrecioBase = 72000,
                PrecioAlquiler = 22000,
                ConsumoTelaAprox = 1.4m,
                ImagenUrl = "https://images.unsplash.com/photo-1583498258688-c9893971f9?w=400"
            },
            new PrendaCatalogo
            {
                Nombre = "FAL-002 Falda midi lino",
                TipoPrenda = "Falda",
                Talla = "M",
                Color = "Crema",
                Cantidad = 6,
                Estado = "disponible",
                PrecioBase = 85000,
                PrecioAlquiler = 26000,
                ConsumoTelaAprox = 1.5m,
                ImagenUrl = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
            },
            // Suéteres (tipo Blusa en el catálogo académico)
            new PrendaCatalogo
            {
                Nombre = "SUE-001 Suéter cuello redondo",
                TipoPrenda = "Blusa",
                Talla = "M",
                Color = "Gris jaspe",
                Cantidad = 11,
                Estado = "disponible",
                PrecioBase = 92000,
                PrecioAlquiler = 27000,
                ConsumoTelaAprox = 2.2m,
                ImagenUrl = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400"
            },
            new PrendaCatalogo
            {
                Nombre = "SUE-002 Suéter cuello alto",
                TipoPrenda = "Blusa",
                Talla = "L",
                Color = "Vino tinto",
                Cantidad = 5,
                Estado = "en confección",
                PrecioBase = 105000,
                PrecioAlquiler = 30000,
                ConsumoTelaAprox = 2.4m,
                ImagenUrl = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"
            },
            new PrendaCatalogo
            {
                Nombre = "BLU-001 Blusa seda elegante",
                TipoPrenda = "Blusa",
                Talla = "S",
                Color = "Blanco",
                Cantidad = 8,
                Estado = "disponible",
                PrecioBase = 78000,
                PrecioAlquiler = 24000,
                ConsumoTelaAprox = 1.6m,
                ImagenUrl = "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400"
            }
        );

        context.SaveChanges();
    }
}

app.UseCors("ReactPolicy");

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();