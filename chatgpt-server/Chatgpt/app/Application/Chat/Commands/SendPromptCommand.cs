using Domain.Chat.Entities;
using Domain.Chat.Entities.Message;
using Domain.Chat.Errors;
using Domain.Common;
using Domain.User;
using Domain.User.Errors;
using Infrastructure.ChatGPT.ChatTitle;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Chat.Commands;

public record SendPromptCommand(
    Guid UserId,
    Guid? ChatId,
    string MessageContent,
    string Model,
    List<Guid> DisplayedMessageIds
) : IRequest<Result<SendPromptResult, Error>>;

public record SendPromptResult(
    Message UserMessage,
    Message AssistantMessage,
    Domain.Chat.Chat Chat
);

public class SendPromptCommandHandler
    : IRequestHandler<SendPromptCommand, Result<SendPromptResult, Error>>
{
    private readonly ApplicationContext _context;
    private readonly ChatTitleService _chatTitleService;

    public SendPromptCommandHandler(ApplicationContext context, ChatTitleService chatTitleService)
    {
        _context = context;
        _chatTitleService = chatTitleService;
    }

    public async Task<Result<SendPromptResult, Error>> Handle(
        SendPromptCommand command,
        CancellationToken ct
    )
    {
        User? user = await _context
            .Users.Where(x => x.Id == command.UserId)
            .Include(u => u.Chats.Where(c => c.Id == command.ChatId))
            .SingleOrDefaultAsync(cancellationToken: ct);

        if (user == null)
            return ErrorsUser.NotFound();

        if (!user.CanAccess(command.Model))
            return ErrorsUser.HasNoModelAccess;

        if (user.ReachedMaxMessages())
            return ErrorsUser.ReachedMessageLimit;

        Domain.Chat.Chat? chat = user.Chats.SingleOrDefault();
        if (chat != null)
        {
            await _context.Entry(chat).Collection(c => c.Messages).LoadAsync(ct);
            if (chat.ReachedMaxMessages())
                return ErrorsChat.ReachedMessageLimit;

            if (user.ReachedMaxMessages())
                return ErrorsUser.ReachedMessageLimit;
        }
        else
        {
            chat = new Domain.Chat.Chat(
                await _chatTitleService.CreateTitle(command.MessageContent)
            );

            user.AddChat(chat);
        }

        Guid? lastMessagId = command.DisplayedMessageIds.LastOrDefault();
        Guid? linkId = lastMessagId == Guid.Empty ? null : lastMessagId;
        Message userMessage = new(command.MessageContent, Sender.User, linkId);
        chat.AddNewMessage(userMessage);

        Message assistantMessage = new("", Sender.Assistant, userMessage.Id);
        chat.AddNewMessage(assistantMessage);

        user.IncrementSentMessages();

        await _context.SaveChangesAsync(CancellationToken.None);

        return Result.Ok(new SendPromptResult(userMessage, assistantMessage, chat));
    }
}
