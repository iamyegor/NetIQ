using System.Security.Claims;
using Api.Controllers.Common;
using Domain.User.Entities;
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

    [HttpGet("subscription"), Authorize]
    public async Task<IActionResult> GetSubscriptionStatus()
    {
        Guid userId = Guid.Parse(User.FindFirstValue(JwtClaims.UserId)!);

        Subscription? subscription = await _context
            .Users.Where(x => x.Id == userId)
            .Select(x => x.Subscription)
            .SingleOrDefaultAsync();

        return Ok(new { subscription = subscription?.Name });
    }
}
