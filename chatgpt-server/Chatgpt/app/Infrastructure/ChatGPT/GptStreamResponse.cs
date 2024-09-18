namespace Infrastructure.ChatGPT;

public class GptStreamResponse
{
    public Choice[] Choices { get; set; }
}

public class Choice
{
    public Delta Delta { get; set; }
}

public class Delta
{
    public string Role { get; set; }
    public string Content { get; set; }
}
