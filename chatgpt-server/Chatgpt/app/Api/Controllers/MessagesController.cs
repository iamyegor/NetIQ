using System.Security.Claims;
using Api.Controllers.Common;
using Api.Dtos;
using Domain.Chat;
using Domain.Chat.Entities;
using Domain.Chat.Errors;
using Infrastructure.Auth;
using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/chats/{chatId}/messages")]
public class MessagesController : StreamerController
{
    public MessagesController(ApplicationContext context, ChatGpt chatGpt)
        : base(context, chatGpt) { }

    [HttpPost("edit"), Authorize]
    public async Task EditPrompt(Guid chatId, EditPromptRequest request, CancellationToken ct)
    {
        InitializeResponseHeaders();

        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

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

        List<ChatGptMessage> gptMessages = chat
            .Messages.Where(m => request.DisplayedMessageIds.Contains(m.Id))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
            .ToList();

        Message userMessage = await AddUserMessage(
            chat,
            request.MessageContent,
            request.DisplayedMessageIds,
            ct,
            true
        );
        await AddAssistantMessage(chat, userMessage.Id, ct);
        gptMessages.Add(new ChatGptMessage(userMessage.Sender.Value, userMessage.Content));

        await StreamChatGptResponse(chat.Messages.Last(), gptMessages, request.Model, ct);

        await Context.SaveChangesAsync(CancellationToken.None);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }

    [HttpPost("regenerate"), Authorize]
    public async Task RegenerateResponse(
        Guid chatId,
        RegenerateResponseRequest request,
        CancellationToken ct
    )
    {
        InitializeResponseHeaders();

        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

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

        List<ChatGptMessage> gptMessages = chat
            .Messages.Where(m => request.DisplayedMessageIds.Contains(m.Id))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
            .ToList();

        Message regeneratedResponse = chat.RegenerateResponse(request.DisplayedMessageIds.Last());

        await SendAssistantMessageStart(regeneratedResponse, ct);

        await StreamChatGptResponse(regeneratedResponse, gptMessages, request.Model, ct);

        await Context.SaveChangesAsync(CancellationToken.None);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }

    [HttpPost("{messageId}/select"), Authorize]
    public async Task<IActionResult> SelectMessage(
        Guid chatId,
        Guid messageId,
        SendMessageRequest request
    )
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

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

    [HttpGet, Authorize]
    public async Task<IActionResult> GetMessages(Guid chatId)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

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

    [HttpPost, Authorize]
    public async Task PromptAsync(Guid chatId, PromptRequest request, CancellationToken ct)
    {
        InitializeResponseHeaders();

        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

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

        Message userMessage = await AddUserMessage(
            chat,
            request.MessageContent,
            request.DisplayedMessageIds,
            ct
        );
        Message assistantMessage = await AddAssistantMessage(chat, userMessage.Id, ct);

        List<ChatGptMessage> gptMessages = chat
            .Messages.Where(m =>
                request.DisplayedMessageIds.Contains(m.Id) || m.Id == userMessage.Id
            )
            .OrderBy(x => x.CreatedAt)
            .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
            .ToList();

        await StreamChatGptResponse(assistantMessage, gptMessages, request.Model, ct);

        await Context.SaveChangesAsync(CancellationToken.None);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }
}
