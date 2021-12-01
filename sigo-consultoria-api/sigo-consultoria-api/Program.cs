using AutoMapper;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var configBuilder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
               .AddEnvironmentVariables();

IConfigurationRoot configurationApp = configBuilder.Build();

var configuration = new MapperConfiguration(config => {
    config.CreateMap<ConsultoriaModelView, Consultoria>();
    config.CreateMap<Consultoria, ConsultoriaModelView>();
});
var mapper = configuration.CreateMapper();
var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.IncludeFields = true;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(null, false));
});
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer("Server=tcp:sigo-dbserver.database.windows.net,1433;Initial Catalog=sigo-consultoria-api_db;Persist Security Info=False;User ID=kassius;Password=p4t0s@azure;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "sigo",
                      builder =>
                      {
                          builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
                      });
});
builder.Services.AddSingleton(mapper);
var app = builder.Build();
app.UseCors("sigo");

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();



app.MapGet("api/v1/consultoria", (AppDbContext dbContext) => dbContext.Consultorias.ToList()).WithName("V1/GetConsultoria");

app.MapPost("api/v1/consultoria", (IMapper mapper, AppDbContext dbContext, ConsultoriaModelView normaModelView) =>
{
    var consultoria = mapper.Map<Consultoria>(normaModelView);
    dbContext.Consultorias.Add(consultoria);
    dbContext.SaveChanges();
    return Results.Created(consultoria.Id.ToString(), consultoria);
})
.WithName("V1/PostConsultoria");

app.Run();

class AppDbContext : DbContext
{
    public DbSet<Consultoria> Consultorias { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options): base(options) { }

}

class Consultoria
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public int ValorPago { get; set; }
    public int QuantidadeProfisionais { get; set; }
    public bool Ativo { get; set; }
}


class ConsultoriaModelView
{
    public string Nome { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public int ValorPago { get; set; }
    public int QuantidadeProfisionais { get; set; }
    public bool Ativo { get; set; }
}
