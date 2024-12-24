using Domain.Common;
using Domain.User;
using Domain.User.Errors;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SharedKernel.Utils;
using XResults;

namespace Application.Stripe.Queries;

public record GetSubscriptionPriceIdQuery(Guid UserId) : IRequest<Result<string?, Error>>;

public class GetSubscriptionPriceIdQueryHandler
    : IRequestHandler<GetSubscriptionPriceIdQuery, Result<string?, Error>>
{
    private readonly ApplicationContext _context;

    public GetSubscriptionPriceIdQueryHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<Result<string?, Error>> Handle(
        GetSubscriptionPriceIdQuery query,
        CancellationToken ct
    )
    {
        User? user = await _context
            .Users.Include(u => u.Subscription)
            .FirstOrDefaultAsync(u => u.Id == query.UserId, ct);

        if (user == null)
            return ErrorsUser.NotFound($"UserId: {query.UserId}");

        return AppEnv.IsDevelopment
            ? user.Subscription?.PriceIdDev
            : user.Subscription?.PriceIdProd;
    }
}
