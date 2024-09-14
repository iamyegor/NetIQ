using Api.Controllers.Common;
using Api.Dtos;
using Domain.DomainErrors;
using Domain.User;
using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Api.Controllers;

[ApiController]
[Route("api/chats/{chatId}/messages")]
public class MessagesController : StreamerController
{
    public MessagesController(ApplicationContext context, ChatGpt chatGpt)
        : base(context, chatGpt) { }

    [HttpGet("edit")]
    public async Task EditPrompt(
        Guid chatId,
        [FromQuery] string messageContent,
        [FromQuery] string messagesToSend,
        CancellationToken ct
    )
    {
        InitializeResponseHeaders();

        Guid userId = (await Context.Users.SingleAsync(ct)).Id;

        Chat? chat = await Context
            .Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Chats)
            .SingleOrDefaultAsync(c => c.Id == chatId, ct);

        if (chat == null)
        {
            await SendSseErrorAsync("Chat not found", CancellationToken.None);
            return;
        }

        await Context.Entry(chat).Collection(c => c.Messages).LoadAsync(ct);

        List<Guid> displayedMessageIds =
            JsonConvert.DeserializeObject<List<Guid>>(messagesToSend) ?? [];
        List<ChatGptMessage> gptMessages = chat
            .Messages.Where(m => displayedMessageIds.Contains(m.Id))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
            .ToList();

        Message userMessage = await AddUserMessage(
            chat,
            messageContent,
            displayedMessageIds,
            ct,
            true
        );
        await AddAssistantMessage(chat, userMessage.Id, ct);
        gptMessages.Add(new ChatGptMessage(userMessage.Sender.Value, userMessage.Content));

        await StreamChatGptResponse(chat.Messages.Last(), gptMessages, ct);

        await Context.SaveChangesAsync(CancellationToken.None);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }

    [HttpGet("regenerate")]
    public async Task RegenerateResponse(
        Guid chatId,
        [FromQuery] string messagesToSend,
        CancellationToken ct
    )
    {
        InitializeResponseHeaders();

        Guid userId = (await Context.Users.SingleAsync(ct)).Id;

        Chat? chat = await Context
            .Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Chats)
            .SingleOrDefaultAsync(c => c.Id == chatId, ct);

        if (chat == null)
        {
            await SendSseErrorAsync("Chat not found", CancellationToken.None);
            return;
        }

        await Context.Entry(chat).Collection(c => c.Messages).LoadAsync(ct);

        List<Guid> displayedMessageIds =
            JsonConvert.DeserializeObject<List<Guid>>(messagesToSend) ?? [];
        List<ChatGptMessage> gptMessages = chat
            .Messages.Where(m => displayedMessageIds.Contains(m.Id))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
            .ToList();

        Message regeneratedResponse = chat.RegenerateResponse(displayedMessageIds.Last());

        await SendAssistantMessageStart(regeneratedResponse, ct);

        await StreamChatGptResponse(regeneratedResponse, gptMessages, ct);

        await Context.SaveChangesAsync(CancellationToken.None);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }

    [HttpPost("{messageId}/select")]
    public async Task<IActionResult> SelectMessage(
        Guid chatId,
        Guid messageId,
        SendMessageRequest request
    )
    {
        // Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);
        Guid userId = (await Context.Users.SingleAsync()).Id;

        List<Message> messages = await Context
            .Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Chats.Where(c => c.Id == chatId))
            .SelectMany(u => u.Messages.Where(m => m.LinkId == request.LinkId))
            .ToListAsync();

        if (!messages.Exists(x => x.Id == messageId))
        {
            return BadRequest("idi nahuy");
        }

        foreach (var message in messages)
        {
            message.IsSelected = message.Id == messageId;
        }

        await Context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetMessagesAsync(Guid chatId)
    {
        // Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);
        Guid userId = (await Context.Users.SingleAsync()).Id;

        Chat? chat = await Context
            .Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Chats)
            .Include(c => c.Messages)
            .SingleOrDefaultAsync(c => c.Id == chatId);

        if (chat == null)
        {
            return BadRequest(Errors.Chat.NotFound);
        }

        await Context.Entry(chat).Collection(c => c.Messages).LoadAsync();

        return Ok(chat.Messages.OrderBy(x => x.CreatedAt).Adapt<List<MessageDto>>());
    }

    [HttpGet("stream")]
    public async Task PromptAsync(
        [FromQuery] string message,
        [FromQuery] Guid chatId,
        [FromQuery] string displayedMessages,
        CancellationToken ct
    )
    {
        InitializeResponseHeaders();

        // Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);
        Guid userId = (await Context.Users.SingleAsync(ct)).Id;

        Chat? chat = await Context
            .Users.Where(u => u.Id == userId)
            .SelectMany(u => u.Chats)
            .SingleOrDefaultAsync(c => c.Id == chatId, ct);

        if (chat == null)
        {
            await SendSseErrorAsync("Chat not found", CancellationToken.None);
            return;
        }

        await Context.Entry(chat).Collection(c => c.Messages).LoadAsync(ct);

        List<Guid> displayedMessagesList =
            JsonConvert.DeserializeObject<List<Guid>>(displayedMessages) ?? [];
        Message userMessage = await AddUserMessage(chat, message, displayedMessagesList, ct);
        Message assistantMessage = await AddAssistantMessage(chat, userMessage.Id, ct);

        List<ChatGptMessage> gptMessages = chat
            .Messages.Where(m => displayedMessagesList.Contains(m.Id) || m.Id == userMessage.Id)
            .OrderBy(x => x.CreatedAt)
            .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
            .ToList();

        await StreamChatGptResponse(assistantMessage, gptMessages, ct);

        await Context.SaveChangesAsync(CancellationToken.None);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }
}
