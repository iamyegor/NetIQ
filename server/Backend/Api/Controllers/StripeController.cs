using System.Security.Claims;
using Api.Controllers.Common;
using Api.Dtos.Stripe;
using Application.Stripe.Commands;
using Application.Stripe.Queries;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharedKernel.Auth;
using XResults;

namespace Api.Controllers;

[ApiController]
[Route("stripe")]
public class StripeController : ApplicationController
{
    private readonly IMediator _mediator;

    public StripeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpPost("checkout-session/create")]
    public async Task<IActionResult> CreateCheckoutSession(
        CreateCheckoutSessionDto dto,
        CancellationToken ct
    )
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Result<string, Error> result = await _mediator.Send(
            new CreateCheckoutSessionCommand(userId, dto.PriceId),
            ct
        );
        if (result.IsFailure)
            return Problem(result.Error);

        return Ok(new { redirectUrl = result.Value });
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook(CancellationToken ct)
    {
        string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        string? stripeSignature = HttpContext.Request.Headers["Stripe-Signature"];

        Result<SuccessOr<Error>, Error> result = await _mediator.Send(
            new WebhookCommand(json, stripeSignature),
            ct
        );

        return FromResult(result);
    }

    [Authorize]
    [HttpPost("subscription/update")]
    public async Task<IActionResult> UpdateSubscription(
        [FromBody] UpdateSubscriptionDto dto,
        CancellationToken ct
    )
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        SuccessOr<Error> result = await _mediator.Send(
            new UpdateSubscriptionCommand(userId, dto.NewPriceId),
            ct
        );
        if (result.IsFailure)
            return Problem(result.Error);

        return Ok();
    }

    [Authorize]
    [HttpGet("subscription/price-id")]
    public async Task<IActionResult> GetSubscriptionPriceId(CancellationToken ct)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Result<string?, Error> result = await _mediator.Send(
            new GetSubscriptionPriceIdQuery(userId),
            ct
        );
        if (result.IsFailure)
            return Problem(result.Error);

        return Ok(new { priceId = result.Value });
    }

    [Authorize]
    [HttpPost("subscription/cancel")]
    public async Task<IActionResult> CancelSubscription(CancellationToken ct)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        SuccessOr<Error> result = await _mediator.Send(new CancelSubscriptionCommand(userId), ct);
        if (result.IsFailure)
            return Problem(result.Error);

        return Ok();
    }
}
