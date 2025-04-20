using System.Text;
using Domain.Chat;
using Domain.Chat.Entities;
using Domain.Chat.Entities.Message;
using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Newtonsoft.Json;

namespace Api.Controllers.Common;

public class StreamerController : ApplicationController
{
    protected readonly ApplicationContext Context;
    protected readonly ChatGpt ChatGpt;

    public StreamerController(ApplicationContext context, ChatGpt chatGpt)
    {
        Context = context;
        ChatGpt = chatGpt;
    }

    protected async Task SendSseEventAsync(
        string data,
        CancellationToken cancellationToken,
        string? eventType = "message"
    )
    {
        StringBuilder builder = new();
        if (!string.IsNullOrEmpty(eventType))
            builder.Append($"event: {eventType}\n");

        string formattedData = data.Replace("\n", "\ndata: ");
        builder.Append($"data: {formattedData}\n\n");

        await Response.WriteAsync(builder.ToString(), cancellationToken);
        await Response.Body.FlushAsync(cancellationToken);
    }

    protected async Task SendSseErrorAsync(string error, CancellationToken cancellationToken)
    {
        StringBuilder builder = new();
        builder.Append("event: error\n");
        builder.Append($"data: {error}\n\n");

        await Response.WriteAsync(builder.ToString(), cancellationToken);
        await Response.Body.FlushAsync(cancellationToken);
    }

    protected void InitializeResponseHeaders()
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
    }

    protected async Task StreamInitialDataForSendPrompt(
        Chat chat,
        Guid userMessageId,
        Guid assistantMessageId,
        CancellationToken ct
    )
    {
        await Context.SaveChangesAsync(ct);

        var data = new
        {
            type = "init_data",
            userMessageId,
            assistantMessageId,
            chat = new
            {
                id = chat.Id,
                title = chat.Title,
                lastUpdatedAt = chat.LastUpdatedAt
            }
        };
        await SendSseEventAsync(JsonConvert.SerializeObject(data), ct);
    }

    protected async Task StreamInitialDataForRegenerateResponse(
        Message assistantMessage,
        CancellationToken ct
    )
    {
        var data = new { type = "init_data", assistantMessageId = assistantMessage.Id, };
        await SendSseEventAsync(JsonConvert.SerializeObject(data), ct);
    }

    protected async Task StreamChatGptResponse(
        Message assistantMessage,
        string userMessage,
        string model,
        CancellationToken ct
    )
    {
        ChatGptMessage userChatgptMessage = new(Sender.User.Value, userMessage);
        await StreamChatGptResponse(assistantMessage, [userChatgptMessage], model, ct);
    }

    protected async Task StreamChatGptResponse(
        Message assistantMessage,
        List<ChatGptMessage> gptMessages,
        string model,
        CancellationToken ct
    )
    {
        try
        {
            await foreach (
                ChatGptUpdate chatGptUpdate in ChatGpt
                    .GetStreamResponseAsync(gptMessages, model)
                    .WithCancellation(ct)
            )
            {
                if (chatGptUpdate.Content == null || chatGptUpdate.IsComplete)
                    continue;

                assistantMessage.AppendContent(chatGptUpdate.Content);
                await SendSseEventAsync(
                    JsonConvert.SerializeObject(
                        new
                        {
                            type = "assistant_message_content",
                            id = assistantMessage.Id,
                            content = chatGptUpdate.Content
                        }
                    ),
                    ct
                );
            }
        }
        catch (OperationCanceledException) { }

        await Context.SaveChangesAsync(CancellationToken.None);
    }
}
