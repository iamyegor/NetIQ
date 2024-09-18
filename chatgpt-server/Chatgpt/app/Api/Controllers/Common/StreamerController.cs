using System.Text;
using Domain.Chat;
using Domain.Chat.Entities;
using Domain.User;
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
        StringBuilder builder = new StringBuilder();
        if (!string.IsNullOrEmpty(eventType))
        {
            builder.Append($"event: {eventType}\n");
        }
        string formattedData = data.Replace("\n", "\ndata: ");
        builder.Append($"data: {formattedData}\n\n");

        await Response.WriteAsync(builder.ToString(), cancellationToken);
        await Response.Body.FlushAsync(cancellationToken);
    }

    protected async Task SendSseErrorAsync(string error, CancellationToken cancellationToken)
    {
        var builder = new StringBuilder();
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

    protected async Task<Message> AddUserMessage(
        Chat chat,
        string message,
        List<Guid> displayedMessagesList,
        CancellationToken ct,
        bool isSelected = false
    )
    {
        Guid? linkId = displayedMessagesList.LastOrDefault();
        linkId = linkId == Guid.Empty ? null : linkId;
        Message userMessage = new Message(message, Sender.User, linkId);
        chat.AddMessage(userMessage);
        chat.SelectMessage(userMessage);
        await Context.SaveChangesAsync(ct);

        await SendSseEventAsync(
            JsonConvert.SerializeObject(
                new
                {
                    type = "user_message",
                    id = userMessage.Id,
                    content = userMessage.Content,
                    createdAt = userMessage.CreatedAt,
                    linkId = userMessage.LinkId,
                    isSelected = userMessage.IsSelected,
                    chat = new
                    {
                        id = chat.Id,
                        title = chat.Title,
                        lastUpdatedAt = chat.LastUpdatedAt
                    }
                }
            ),
            ct
        );

        return userMessage;
    }

    protected async Task<Message> AddAssistantMessage(Chat chat, Guid? linkId, CancellationToken ct)
    {
        Message assistantMessage = new("", Sender.Assistant, linkId) { IsSelected = true };
        chat.AddMessage(assistantMessage);

        await SendAssistantMessageStart(assistantMessage, ct);

        return assistantMessage;
    }

    protected async Task SendAssistantMessageStart(Message assestantMessage, CancellationToken ct)
    {
        await SendSseEventAsync(
            JsonConvert.SerializeObject(
                new
                {
                    type = "assistant_message_start",
                    id = assestantMessage.Id,
                    createdAt = assestantMessage.CreatedAt,
                    linkId = assestantMessage.LinkId,
                    isSelected = assestantMessage.IsSelected
                }
            ),
            ct
        );
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
                var chatGptUpdate in ChatGpt
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
    }
}
