using System.Security.Claims;
using Api.Controllers.Common;
using Application.Chat.Commands;
using Application.Chat.Queries;
using Domain.Common;
using Infrastructure.Auth;
using Infrastructure.ChatGPT;
using Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XResults;

namespace Api.Controllers;

[ApiController]
[Route("chats")]
public class ChatController : StreamerController
{
    private readonly IMediator _mediator;

    public ChatController(ChatGpt chatGpt, ApplicationContext context, IMediator mediator)
        : base(context, chatGpt)
    {
        _mediator = mediator;
    }

    [HttpDelete("{chatId}"), Authorize]
    public async Task<IActionResult> DeleteChat(Guid chatId)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        SuccessOr<Error> result = await _mediator.Send(new DeleteChatCommand(userId, chatId));

        return FromResult(result);
    }

    [HttpGet, Authorize]
    public async Task<IActionResult> GetChats([FromQuery] int page = 1)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Result<GetChatsResult, Error> result = await _mediator.Send(
            new GetChatsQuery(userId, page)
        );

        return FromResult(result);
    }
}
