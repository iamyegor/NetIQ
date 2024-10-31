using Newtonsoft.Json;

namespace Infrastructure.ChatGPT;

public class ChatGpt
{
    private readonly GptHttpClient _gptClient;

    public ChatGpt(GptHttpClient gptClient)
    {
        _gptClient = gptClient;
    }

    public async IAsyncEnumerable<ChatGptUpdate> GetStreamResponseAsync(
        IEnumerable<ChatGptMessage> messages,
        string model
    )
    {
        HttpResponseMessage response = await _gptClient.SendAsync(messages, true, model);

        await foreach (ChatGptUpdate update in ProcessStreamingResponse(response))
        {
            yield return update;
        }
    }

    private async IAsyncEnumerable<ChatGptUpdate> ProcessStreamingResponse(
        HttpResponseMessage response
    )
    {
        using Stream stream = await response.Content.ReadAsStreamAsync();
        using StreamReader reader = new StreamReader(stream);

        while (!reader.EndOfStream)
        {
            string? line = await reader.ReadLineAsync();
            if (line == null || !line.StartsWith("data: "))
            {
                continue;
            }

            string jsonData = line.Substring("data: ".Length);
            if (jsonData == "[DONE]")
            {
                yield return ChatGptUpdate.Complete();
                yield break;
            }

            GptStreamResponse? chatResponse = JsonConvert.DeserializeObject<GptStreamResponse>(
                jsonData
            );
            if (
                chatResponse?.Choices[0].Delta != null
                && !string.IsNullOrEmpty(chatResponse.Choices[0].Delta.Content)
            )
            {
                yield return new ChatGptUpdate(chatResponse.Choices[0].Delta.Content);
            }
        }
    }

    public async Task<string> GetResponseAsync(IEnumerable<ChatGptMessage> messages)
    {
        HttpResponseMessage response = await _gptClient.SendAsync(messages, false);
        string responseBody = await response.Content.ReadAsStringAsync();

        GptResponse? jsonResponse = JsonConvert.DeserializeObject<GptResponse>(responseBody);
        string content = jsonResponse?.Choices.FirstOrDefault()?.Message.Content ?? string.Empty;
        return content;
    }
}
