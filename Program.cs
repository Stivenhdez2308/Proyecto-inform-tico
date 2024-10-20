using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using EcografiaApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers();
builder.Services.AddSingleton<IMongoClient>(s => 
    new MongoClient(builder.Configuration.GetConnectionString("MongoDB")));
builder.Services.AddScoped<DoctorService>();

var app = builder.Build();

// Configurar el pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllers();

// Configurar rutas para páginas HTML estáticas
app.MapFallbackToFile("/", "index.html");
app.MapFallbackToFile("/contacto", "contacto.html");
app.MapFallbackToFile("/registro-doctor", "registro-doctor.html");
// Agregar más mapeos según sea necesario para otras páginas

app.Run();
