using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using MassTransit;
using Serilog;
using SharedKernel.Communication.Events;

namespace Api.Controllers;

public class UserRegisteredConsumer : IConsumer<UserRegisteredEvent>
{
    private readonly ApplicationContext _context;

    public UserRegisteredConsumer(ApplicationContext context)
    {
        _context = context;
    }

    public async Task Consume(ConsumeContext<UserRegisteredEvent> consumeContext)
    {
        Email email = Email.Create(consumeContext.Message.Email);

        User user = User.Create(id: consumeContext.Message.Id, email: email);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        Log.Information($"Chatgpt consumed user: {@user}", user);
    }
}
