using System.Security.Claims;
using Api.Controllers.Common;
using Domain.User.ValueObjects;
using Domain.User.ValueObjects.Email;
using Infrastructure.Auth;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Route("user")]
[ApiController]
public class UserController : ApplicationController
{
    private readonly ApplicationContext _context;

    public UserController(ApplicationContext context)
    {
        _context = context;
    }

    [HttpGet("email"), Authorize]
    public async Task<IActionResult> GetEmail()
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Email? email = await _context
            .Users.Where(x => x.Id == userId)
            .Select(x => x.Email)
            .SingleOrDefaultAsync();
        
        if (email == null)
            return BadRequest(new { ErrorCode = "user.not.found" });

        return Ok(new { email = email.Value });
    }

    [HttpGet("subscription-status"), Authorize]
    public async Task<IActionResult> GetSubscriptionStatus()
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        SubscriptionStatus? subscriptionStatus = await _context
            .Users.Where(x => x.Id == userId)
            .Select(x => x.SubscriptionStatus)
            .SingleOrDefaultAsync();

        if (subscriptionStatus == null)
            return BadRequest(new { ErrorCode = "user.not.found" });

        return Ok(new { subscriptionStatus = subscriptionStatus.Value });
    }
}
