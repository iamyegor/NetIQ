using Domain.Common;
using Domain.User;
using Domain.User.Errors;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Chat.Queries;

public record GetChatsQuery(Guid UserId, int Page) : IRequest<Result<GetChatsResult, Error>>;

public record GetChatsResult(List<Domain.Chat.Chat> Chats, int? NextPageNumber);

public class GetChatsQueryHandler : IRequestHandler<GetChatsQuery, Result<GetChatsResult, Error>>
{
    private readonly ApplicationContext _context;
    private const int PageSize = 10;

    public GetChatsQueryHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<Result<GetChatsResult, Error>> Handle(
        GetChatsQuery query,
        CancellationToken ct
    )
    {
        User? user = await _context
            .Users.Include(u => u.Chats.OrderByDescending(c => c.LastUpdatedAt))
            .SingleOrDefaultAsync(u => u.Id == query.UserId, cancellationToken: ct);

        if (user == null)
            return ErrorsUser.NotFound();

        int totalChats = user.Chats.Count;
        int totalPages = (int)Math.Ceiling(totalChats / (double)PageSize);

        List<Domain.Chat.Chat> chats = await _context
            .Users.SelectMany(u => u.Chats)
            .Where(c => c.UserId == query.UserId)
            .OrderByDescending(c => c.LastUpdatedAt)
            .Skip((query.Page - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync(cancellationToken: ct);

        int? nextPageNumber = query.Page < totalPages ? query.Page + 1 : null;

        return new GetChatsResult(chats, nextPageNumber);
    }
}
