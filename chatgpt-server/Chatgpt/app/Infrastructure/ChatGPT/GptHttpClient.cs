using System.Net;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace Infrastructure.ChatGPT;

public class GptHttpClient
{
    private const string ApiUrl = "https://api.openai.com/v1/chat/completions";
    private readonly HttpClient _client;

    public GptHttpClient(
        string apiKey,
        string proxyAddress,
        string proxyUsername,
        string proxyPassword
    )
    {
        WebProxy proxy = new WebProxy(proxyAddress)
        {
            Credentials = new NetworkCredential(proxyUsername, proxyPassword)
        };

        HttpClientHandler httpClientHandler = new HttpClientHandler
        {
            Proxy = proxy,
            UseProxy = true
        };

        HttpClient client = new HttpClient(httpClientHandler);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            apiKey
        );

        _client = client;
    }

    public async Task<HttpResponseMessage> SendAsync(
        IEnumerable<ChatGptMessage> messages,
        bool stream,
        string model = "gpt-4o-mini"
    )
    {
        HttpRequestMessage request = CreateHttpRequestMessage(messages, stream, model);
        HttpResponseMessage response;
        if (stream)
        {
            response = await _client
                .SendAsync(request, HttpCompletionOption.ResponseHeadersRead)
                .ConfigureAwait(false);
        }
        else
        {
            response = await _client.SendAsync(request).ConfigureAwait(false);
        }

        response.EnsureSuccessStatusCode();

        return response;
    }

    private HttpRequestMessage CreateHttpRequestMessage(
        IEnumerable<ChatGptMessage> messages,
        bool stream,
        string model 
    )
    {
        if (model != "gpt-4o-mini" && model != "gpt-4o")
            throw new ArgumentException("Invalid model");

        var messagesToSend = messages.Select(x => new { role = x.Role, content = x.Message });
        object requestData = new
        {
            model,
            messages = messagesToSend,
            stream
        };

        StringContent content = new StringContent(
            JsonConvert.SerializeObject(requestData),
            Encoding.UTF8,
            "application/json"
        );
        return new HttpRequestMessage(HttpMethod.Post, ApiUrl) { Content = content };
    }
}
