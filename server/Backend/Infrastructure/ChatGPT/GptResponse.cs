namespace Infrastructure.ChatGPT;

public class GptResponse
{
    public List<GptChoice> Choices { get; set; }
}

public class GptChoice
{
    public GptMessage Message { get; set; }
}

public class GptMessage
{
    public string Role { get; set; }

    public string Content { get; set; }
}
