namespace Api.Dtos;

public class PromptRequest
{
    public List<Guid> DisplayedMessageIds { get; set; }
    public string MessageContent { get; set; }
    public string Model { get; set; }
}
