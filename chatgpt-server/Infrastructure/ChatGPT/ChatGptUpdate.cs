namespace Infrastructure.ChatGPT;

public class ChatGptUpdate
{
    public string? Content { get; }
    public bool IsComplete { get; private set; }

    public ChatGptUpdate(string content)
    {
        Content = content;
    }

    private ChatGptUpdate() { }

    public static ChatGptUpdate Complete()
    {
        return new ChatGptUpdate() { IsComplete = true };
    }
}
