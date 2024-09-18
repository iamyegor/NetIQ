namespace Infrastructure.ChatGPT;

public class ChatGptMessage
{
    public string Role { get; }
    public string Message { get; }

    public ChatGptMessage(string role, string message)
    {
        Role = role;
        Message = message;
    }
}