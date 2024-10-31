using Domain.Chat.Errors;
using Domain.Common;
using Domain.User;
using Domain.User.Errors;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Chat.Commands;

public record DeleteChatCommand(Guid UserId, Guid ChatId) : IRequest<SuccessOr<Error>>;

public class DeleteChatCommandHandler : IRequestHandler<DeleteChatCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;

    public DeleteChatCommandHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<SuccessOr<Error>> Handle(
        DeleteChatCommand command,
        CancellationToken cancellationToken
    )
    {
        User? user = await _context
            .Users.Include(u => u.Chats.Where(c => c.Id == command.ChatId))
            .FirstOrDefaultAsync(u => u.Id == command.UserId, cancellationToken);

        if (user is null)
            return ErrorsUser.NotFound;

        if (user.Chats.Count == 0)
            return ErrorsChat.NotFound;

        user.DeleteChat(command.ChatId);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Ok();
    }
}
