using System.Security.Claims;
using Api.Controllers.Common;
using Api.Dtos;
using Domain.Chat;
using Domain.Chat.Entities;
using Domain.User;
using Infrastructure.Auth;
using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Errors = Domain.User.Errors.Errors;

namespace Api.Controllers;

[ApiController]
[Route("api/chats")]
public class ChatController : StreamerController
{
    private const int PageSize = 10;

    public ChatController(ChatGpt chatGpt, ApplicationContext context)
        : base(context, chatGpt) { }

    [HttpDelete("{chatId}"), Authorize]
    public async Task<IActionResult> DeleteChat(Guid chatId)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        User? user = await Context
            .Users.Include(u => u.Chats.Where(c => c.Id == chatId))
            .FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return BadRequest(Errors.User.NotFound);
        }

        if (user.Chats.Count == 0)
        {
            return BadRequest(Domain.Chat.Errors.Errors.Chat.NotFound);
        }

        user.DeleteChat(chatId);
        await Context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet, Authorize]
    public async Task<IActionResult> GetChatsAsync([FromQuery] int page = 1)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        User? user = await Context
            .Users.Include(u => u.Chats.OrderByDescending(c => c.LastUpdatedAt))
            .SingleOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return BadRequest(Errors.User.NotFound);
        }

        int totalChats = user.Chats.Count;
        int totalPages = (int)Math.Ceiling(totalChats / (double)PageSize);

        List<Chat> chats = await Context
            .Users.SelectMany(u => u.Chats)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.LastUpdatedAt)
            .Skip((page - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync();

        ChatsResponseDto response = new ChatsResponseDto
        {
            Chats = chats,
            NextPageNumber = page < totalPages ? page + 1 : null
        };

        return Ok(response);
    }

    [HttpPost("stream"), Authorize]
    public async Task StartChat(StartChatRequest request, CancellationToken ct)
    {
        InitializeResponseHeaders();

        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        User? user = await Context.Users.SingleOrDefaultAsync(x => x.Id == userId, ct);
        if (user == null)
        {
            await SendSseErrorAsync("User not found", CancellationToken.None);
            return;
        }
        
        if (!user.CanAccess(request.Model))
        {
            await SendSseErrorAsync("User can't access the model", CancellationToken.None);
            return;
        }

        Chat chat = new Chat(await GetChatTitle(request.MessageContent));
        user.AddChat(chat);

        Message userMessage = await AddUserMessage(chat, request.MessageContent, [], ct);
        Message assistantMessage = await AddAssistantMessage(chat, userMessage.Id, ct);

        ChatGptMessage userPrompt = new(userMessage.Sender.Value, userMessage.Content);

        await StreamChatGptResponse(assistantMessage, [userPrompt], request.Model, ct);

        await Context.SaveChangesAsync(CancellationToken.None);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }

    private async Task<string> GetChatTitle(string message)
    {
        string titleResponse = await ChatGpt.GetResponseAsync(
            [
                new ChatGptMessage(Sender.System.Value, SystemInstructions.SystemMessage),
                new ChatGptMessage(Sender.User.Value, message)
            ]
        );
        return titleResponse.Substring(0, Math.Min(titleResponse.Length, 50));
    }
}
