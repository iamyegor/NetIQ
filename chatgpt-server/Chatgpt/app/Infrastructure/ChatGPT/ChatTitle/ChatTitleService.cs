using Domain.Chat.Entities;

namespace Infrastructure.ChatGPT.ChatTitle;

public class ChatTitleService
{
    private readonly ChatGpt _chatGpt;

    public ChatTitleService(ChatGpt chatGpt)
    {
        _chatGpt = chatGpt;
    }

    public async Task<string> CreateTitle(string message)
    {
        string titleResponse = await _chatGpt.GetResponseAsync(
            [
                new ChatGptMessage(Sender.System.Value, SystemInstructions.SystemMessage),
                new ChatGptMessage(Sender.User.Value, message)
            ]
        );
        return titleResponse.Substring(0, Math.Min(titleResponse.Length, 50));
    }
}
