namespace Infrastructure.ChatGPT;

public class SystemInstructions
{
    public static string SystemMessage { get; } =
        "I'll provide you the first message that the user sent to chatGPT, Your task is to create the title for that chat, so the user can easily find it among other chats. VERY IMPORTANT: Provide only the title of the chat without any additional information or quotes or anything else. The limit is 50 symbols";
}
