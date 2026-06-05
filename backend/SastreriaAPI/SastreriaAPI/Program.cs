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
}

app.UseCors("ReactPolicy");

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();