using Domain.Chat.Errors;
using Domain.Common;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Chat.Commands;

public record SelectMessageCommand(Guid UserId, Guid ChatId, Guid MessageId, Guid? LinkId)
    : IRequest<SuccessOr<Error>>;

public class SelectMessageCommandHandler : IRequestHandler<SelectMessageCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;

    public SelectMessageCommandHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<SuccessOr<Error>> Handle(SelectMessageCommand command, CancellationToken ct)
    {
        Domain.Chat.Chat? chat = await _context
            .Users.Where(u => u.Id == command.UserId)
            .SelectMany(u => u.Chats.Where(c => c.Id == command.ChatId))
            .Include(c => c.Messages.Where(m => m.LinkId == command.LinkId))
            .FirstOrDefaultAsync(ct);

        if (chat == null)
            return ErrorsChat.NotFound;

        SuccessOr<Error> selectResult = chat.SelectMessage(command.MessageId);
        if (selectResult.IsFailure)
            return selectResult.Error;

        await _context.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
