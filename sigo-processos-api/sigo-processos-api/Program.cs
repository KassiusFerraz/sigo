using RestSharp;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => {
    options.AddPolicy(name: "sigo",
        builder => {
            builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
        }
    );
});

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();
app.UseCors("sigo");
app.MapPost("api/v1/consultoria", (ConsultoriaRequest consultoriaRequest) =>
{
    var normas = NormaService.BuscarNorma("CONTRATO_CONSULTORIA");
    var listaDeErros = new List<ErroResponse>();
    foreach (var norma in normas)
    {
        foreach (var regra in norma.Regras)
        {
            switch (regra.Campo)
            {
                case "QUANTIDADE_MINIMA_DIAS":
                    TimeSpan date = Convert.ToDateTime(consultoriaRequest.DataFim) - Convert.ToDateTime(consultoriaRequest.DataInicio);
                    int totalDias = date.Days;
                    if (Int32.Parse(regra.Valor) > totalDias)
                        listaDeErros.Add(new ErroResponse() { Campo = regra.Campo, NomeNorma = norma.Name });
                    break;
                case "VALOR_MAXIMO_AUTORIZADO_PAGAMENTO":
                    if (Int32.Parse(regra.Valor) > consultoriaRequest.ValorPago)
                        listaDeErros.Add(new ErroResponse() { Campo = regra.Campo, NomeNorma = norma.Name });
                    break;
                case "QUANTIDADE_MAXIMA_PROFISSIONAIS_CONSULTORIA":
                    if (Int32.Parse(regra.Valor) > consultoriaRequest.QuantidadeProfisionais)
                        listaDeErros.Add(new ErroResponse() { Campo = regra.Campo, NomeNorma = norma.Name });
                    break;
                default:
                    break;
            }
        }
    }
    if (listaDeErros.Count > 0)
        return Results.BadRequest(listaDeErros);
    ConsultariaService.salvarConsultoria(consultoriaRequest);
    return Results.Created("", consultoriaRequest);
})
.WithName("V1/PostConsultoria");

app.Run();


class ConsultariaService
{
    public static void salvarConsultoria(ConsultoriaRequest consultoriaRequest)
    {
        var client = new RestClient($"{Environment.GetEnvironmentVariable("CONSULTORIA_URL")}/api/v1/consultoria");
        var request = new RestRequest(Method.POST);
        request.AddHeader("accept", "*/*");
        request.AddHeader("Content-Type", "application/json");
        request.AddParameter("application/json", JsonSerializer.Serialize(consultoriaRequest), ParameterType.RequestBody);
        IRestResponse response = client.Execute(request);
    }
}

class NormaService
{
    public static ICollection<NormaResponse> BuscarNorma(string tipoNorma)
    {
        var client = new RestClient($"{Environment.GetEnvironmentVariable("NORMA_URL")}/api/v1/normas?tipo={tipoNorma}&vigente=true");
        var request = new RestRequest(Method.GET);
        request.AddHeader("accept", "application/json");
        var response = client.Execute<List<NormaResponse>>(request);
        return response.Data;
    }
}

class NormaResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Validade { get; set; }
    public List<RegraResponse> Regras { get; set; }
    public string Tipo { get; set; }
}

class RegraResponse
{
    public int Id { get; set; }
    public int IdNorma { get; set; }
    public string Campo { get; set; }
    public string Valor { get; set; }
}

class ConsultoriaRequest
{
    public string Nome { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public int ValorPago { get; set; }
    public int QuantidadeProfisionais { get; set; }
    public bool Ativo { get; set; }
}

class ErroResponse
{
    public string NomeNorma { get; set; }
    public string Campo { get; set; }
}