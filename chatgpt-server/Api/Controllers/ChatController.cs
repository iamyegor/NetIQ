using Api.Controllers.Common;
using Domain.DomainErrors;
using Domain.User;
using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/chats")]
public class ChatController : StreamerController
{
    public ChatController(ChatGpt chatGpt, ApplicationContext context)
        : base(context, chatGpt) { }

    [HttpGet]
    public async Task<IActionResult> GetChatsAsync()
    {
        // Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);
        Guid userId = (await Context.Users.SingleAsync()).Id;

        User? user = await Context
            .Users.Include(u => u.Chats.OrderByDescending(c => c.LastUpdatedAt))
            .SingleOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return BadRequest(Errors.User.NotFound);
        }

        return Ok(user.Chats);
    }

    [HttpGet("stream")]
    public async Task StartChatAsync([FromQuery] string message, CancellationToken ct)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");

        // Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);
        Guid userId = (await Context.Users.SingleAsync(ct)).Id;
        User? user = await Context.Users.SingleOrDefaultAsync(x => x.Id == userId, ct);
        if (user == null)
        {
            await SendSseErrorAsync("User not found", CancellationToken.None);
            return;
        }

        Chat chat = new Chat(await GetChatTitle(message));
        user.AddChat(chat);

        Message userMessage = await AddUserMessage(chat, message, [], ct);
        Message assistantMessage = await AddAssistantMessage(chat, userMessage.Id, ct);

        ChatGptMessage userPrompt = new(userMessage.Sender.Value, userMessage.Content);

        await StreamChatGptResponse(assistantMessage, [userPrompt], ct);

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
