using Api.Dtos;
using Application.Chat.Commands;
using Mapster;

namespace Api.Mappings;

public class SendPromptMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        Guid guid;
        config
            .NewConfig<(Guid id, string? chatId, SendPromptRequest request), SendPromptCommand>()
            .Map(dest => dest.UserId, src => src.id)
            .Map(dest => dest.MessageContent, src => src.request.MessageContent)
            .Map(dest => dest.Model, src => src.request.Model)
            .Map(dest => dest.DisplayedMessageIds, src => src.request.DisplayedMessageIds)
            .Map<Guid?, Guid?>(
                dest => dest.ChatId,
                src => Guid.TryParse(src.chatId, out guid) ? guid : null
            );
    }
}
