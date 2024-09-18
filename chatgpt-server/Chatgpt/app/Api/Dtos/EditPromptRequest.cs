namespace Api.Dtos;

public class EditPromptRequest
{
    public string MessageContent { get; set; }
    public List<Guid> DisplayedMessageIds { get; set; }
    public string Model { get; set; }
}