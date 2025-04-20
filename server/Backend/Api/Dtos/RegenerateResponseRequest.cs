namespace Api.Dtos;

public class RegenerateResponseRequest
{
    public List<Guid> DisplayedMessageIds { get; set; }
    public string Model { get; set; }
}
