namespace Infrastructure.ChatGPT;

public class SystemInstructions
{
    public static string SystemMessage { get; } =
        "Create a concise and descriptive title for a chat based on the user's initial message to an AI chatbot, ensuring it helps users identify and locate the conversation easily among other chats. The title should be no more than 50 characters in length.\n\n# Output Format\n\nA single line with the chat title, not exceeding 50 characters. Do not include additional information, quotes, or formatting.\n\n# Notes\n\n- Consider that you don't know what the chatbot's response will be, so if the user prompts: \"Give me a very long story\", instead of saying something like \"Epic saga\", \"Adventure in the seas\", etc. You should say \"Long story request\", \"Very long story\", \"Request for comprehensive story\", etc (anything of that sort)\n- Avoid being generic, be more creative";
}
