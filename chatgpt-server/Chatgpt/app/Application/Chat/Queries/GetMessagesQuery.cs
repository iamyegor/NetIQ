using Domain.Chat.Entities;
using Domain.Chat.Entities.Message;
using Domain.Chat.Errors;
using Domain.Common;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Chat.Queries;

public record GetMessagesQuery(Guid UserId, Guid ChatId) : IRequest<Result<List<Message>, Error>>;

public class GetMessagesQueryHandler
    : IRequestHandler<GetMessagesQuery, Result<List<Message>, Error>>
{
    private readonly ApplicationContext _context;

    public GetMessagesQueryHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<Result<List<Message>, Error>> Handle(
        GetMessagesQuery command,
        CancellationToken cancellationToken
    )
    {
        Domain.Chat.Chat? chat = await _context
            .Users.Where(u => u.Id == command.UserId)
            .SelectMany(u => u.Chats)
            .Include(c => c.Messages)
            .SingleOrDefaultAsync(
                c => c.Id == command.ChatId,
                cancellationToken: cancellationToken
            );

        if (chat == null)
            return ErrorsChat.NotFound;

        await _context.Entry(chat).Collection(c => c.Messages).LoadAsync(cancellationToken);

        return chat.Messages.OrderBy(x => x.CreatedAt).ToList();
    }
}
