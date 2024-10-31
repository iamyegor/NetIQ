using System.Security.Claims;
using Api.Controllers.Common;
using Api.Dtos;
using Application.Chat.Commands;
using Application.Chat.Queries;
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
[Route("chats/{chatId}/messages")]
public class MessagesController : StreamerController
{
    private readonly IMediator _mediator;

    public MessagesController(ApplicationContext context, ChatGpt chatGpt, IMediator mediator)
        : base(context, chatGpt)
    {
        _mediator = mediator;
    }

    [HttpPost("regenerate")]
    [Authorize]
    public async Task RegenerateResponse(
        Guid chatId,
        RegenerateResponseRequest request,
        CancellationToken ct
    )
    {
        InitializeResponseHeaders();

        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Result<RegenerateResponseResult, Error> result = await _mediator.Send(
            (userId, chatId, request).Adapt<RegenerateResponseCommand>(),
            ct
        );

        if (result.IsFailure)
        {
            await SendSseErrorAsync(result.Error.Code, ct);
            return;
        }

        List<ChatGptMessage> gptMessages = result
            .Value.Chat.Messages.Where(m => request.DisplayedMessageIds.Contains(m.Id))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatGptMessage(m.Sender.Value, m.Content))
            .ToList();

        Message regeneratedResponse = result.Value.RegeneratedResponse;
        await StreamInitialDataForRegenerateResponse(regeneratedResponse, ct);
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

        SuccessOr<Error> result = await _mediator.Send(
            new SelectMessageCommand(userId, chatId, messageId, request.LinkId)
        );

        return FromResult(result);
    }

    [HttpGet, Authorize]
    public async Task<IActionResult> GetMessages(Guid chatId)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Result<List<Message>, Error> messagesOrError = await _mediator.Send(
            new GetMessagesQuery(userId, chatId)
        );

        if (messagesOrError.IsFailure)
            return BadRequest(messagesOrError.Error);

        return Ok(messagesOrError.Value.Adapt<List<MessageDto>>());
    }
}
