using Domain.Chat.Entities;
using Domain.Chat.Entities.Message;
using Domain.Chat.Errors;
using Domain.Common;
using Domain.User;
using Domain.User.Errors;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Chat.Commands;

public record RegenerateResponseCommand(
    Guid UserId,
    Guid ChatId,
    string Model,
    List<Guid> DisplayedMessageIds
) : IRequest<Result<RegenerateResponseResult, Error>>;

public record RegenerateResponseResult(Message RegeneratedResponse, Domain.Chat.Chat Chat);

public class RegenerateResponseCommandHandler
    : IRequestHandler<RegenerateResponseCommand, Result<RegenerateResponseResult, Error>>
{
    private readonly ApplicationContext _context;

    public RegenerateResponseCommandHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<Result<RegenerateResponseResult, Error>> Handle(
        RegenerateResponseCommand command,
        CancellationToken ct
    )
    {
        User? user = await _context
            .Users.Where(u => u.Id == command.UserId)
            .Include(u => u.Chats.Where(c => c.Id == command.ChatId))
            .SingleOrDefaultAsync(c => c.Id == command.UserId, ct);

        if (user == null)
            return ErrorsUser.NotFound;

        if (!user.CanAccess(command.Model))
            return ErrorsUser.HasNoModelAccess;

        Domain.Chat.Chat? chat = user.Chats.SingleOrDefault();
        if (chat == null)
            return ErrorsChat.NotFound;

        await _context.Entry(chat).Collection(c => c.Messages).LoadAsync(ct);
        if (chat.ReachedMaxMessages())
            return ErrorsChat.ReachedMessageLimit;

        if (user.ReachedMaxMessages())
            return ErrorsUser.ReachedMessageLimit;

        Message regeneratedResponse = new("", Sender.Assistant, command.DisplayedMessageIds.Last());
        chat.AddNewMessage(regeneratedResponse);

        await _context.SaveChangesAsync(CancellationToken.None);

        return new RegenerateResponseResult(regeneratedResponse, chat);
    }
}
