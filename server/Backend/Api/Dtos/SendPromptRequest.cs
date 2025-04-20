namespace Api.Dtos;

public record SendPromptRequest(
    string MessageContent,
    string Model,
    List<Guid> DisplayedMessageIds
);
