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
    config.CreateMap<NormaModelView, Norma>();
    config.CreateMap<Norma, NormaModelView>();
    config.CreateMap<RegraModelView, Regra>();
    config.CreateMap<Regra, RegraModelView>();
});
var mapper = configuration.CreateMapper();


var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.IncludeFields = true;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(null, false));
});
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer("Server=tcp:sigo-dbserver.database.windows.net,1433;Initial Catalog=sigo-norma-api_db;Persist Security Info=False;User ID=kassius;Password=p4t0s@azure;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(mapper);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "sigo",
                      builder =>
                      {
                          builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
                      });
});
var app = builder.Build();
app.UseCors("sigo");

app.UseSwagger();
app.UseSwaggerUI();




app.MapGet("api/v1/normas", (AppDbContext dbContext, string? tipo, bool? vigente) =>
{
    IQueryable<Norma> query = dbContext.Normas.Include(norma => norma.Regras);
    if (tipo != null)
    {
        query = query.Where(norma => norma.Tipo == tipo);
    }
    if (vigente != null && vigente == true)
    {
        query = query.Where(norma => norma.Validade > DateTime.Now);
    }
    else if (vigente != null && vigente == false)
    {
        query = query.Where(norma => norma.Validade <= DateTime.Now);
    }
    return query.ToList();
})
.WithName("V1/GetNormas");

app.MapPost("api/v1/normas", (IMapper mapper, AppDbContext dbContext, NormaModelView normaModelView) =>
{
    var norma = mapper.Map<Norma>(normaModelView);
    dbContext.Normas.Add(norma);
    dbContext.SaveChanges();
    return Results.Created(norma.Id.ToString(), norma);
})
.WithName("V1/PostNorma");

app.Run();

class AppDbContext : DbContext
{
    public DbSet<Norma> Normas { get; set; }
    public DbSet<Regra> Regras { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}

class Norma
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Validade { get; set; }
    public List<Regra> Regras { get; set; }
    public string Tipo { get; set; }
}

class Regra
{
    public int Id { get; set; }
    public int IdNorma { get; set; }
    public string Campo { get; set; }
    public string Valor { get; set; }
}

class RegraModelView
{
    public string Campo { get; set; }
    public string Valor { get; set; }
}

class NormaModelView
{
    public string Name { get; set; }
    public DateTime Validade { get; set; }
    public List<RegraModelView> Regras { get; set; }
    public string Tipo { get; set; }
}