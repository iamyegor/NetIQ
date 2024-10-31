using System.Security.Claims;
using Api.Controllers.Common;
using Api.Dtos;
using Application.Chat.Commands;
using Domain.Chat;
using Domain.Chat.Entities.Message;
using Domain.Common;
using Infrastructure.Auth;
using Infrastructure.ChatGPT;
using Infrastructure.Data;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XResults;

namespace Api.Controllers;

[ApiController]
[Route("prompts")]
public class PromptsController : StreamerController
{
    private readonly IMediator _mediator;

    public PromptsController(ApplicationContext context, ChatGpt chatGpt, IMediator mediator)
        : base(context, chatGpt)
    {
        _mediator = mediator;
    }

    [HttpPost, Authorize]
    public async Task SendPrompt(string? chatId, SendPromptRequest request, CancellationToken ct)
    {
        InitializeResponseHeaders();

        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Result<SendPromptResult, Error> result = await _mediator.Send(
            (userId, chatId, request).Adapt<SendPromptCommand>(),
            ct
        );

        if (result.IsFailure)
        {
            await SendSseErrorAsync(result.Error.Code, CancellationToken.None);
            return;
        }

        Message assistantMessage = result.Value.AssistantMessage;
        Message userMessage = result.Value.UserMessage;
        Chat chat = result.Value.Chat;

        await StreamInitialDataForSendPrompt(chat, userMessage.Id, assistantMessage.Id, ct);
        if (chatId == null)
        {
            await StreamChatGptResponse(assistantMessage, userMessage.Content, request.Model, ct);
        }
        else
        {
            List<ChatGptMessage> gptMessages = chat
                .Messages.Where(m =>
                    request.DisplayedMessageIds.Contains(m.Id) || m.Id == userMessage.Id
                )
                .OrderBy(x => x.CreatedAt)
                .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
                .ToList();

            await StreamChatGptResponse(assistantMessage, gptMessages, request.Model, ct);
        }

        await Context.SaveChangesAsync(ct);
        await SendSseEventAsync("Stream ended", CancellationToken.None, "close");
    }
}
