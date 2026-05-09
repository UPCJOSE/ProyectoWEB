using Microsoft.EntityFrameworkCore;
using SastreriaAPI.Data;
using SastreriaAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Servicios
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

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
                Password = "123456",
                Rol = Rol.Administrador
            },
            new Usuario
            {
                Nombre = "Recepcionista",
                Correo = "recepcion@sastreria.com",
                Password = "123456",
                Rol = Rol.Recepcionista
            },
            new Usuario
            {
                Nombre = "Sastre",
                Correo = "sastre@sastreria.com",
                Password = "123456",
                Rol = Rol.Sastre
            },
            new Usuario
            {
                Nombre = "Cliente",
                Correo = "cliente@sastreria.com",
                Password = "123456",
                Rol = Rol.Cliente
            }
        );

        context.SaveChanges();
    }
}

app.UseCors("ReactPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();