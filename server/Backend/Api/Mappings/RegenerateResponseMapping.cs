using Api.Dtos;
using Application.Chat.Commands;
using Mapster;

namespace Api.Mappings;

public class RegenerateResponseMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<
                (Guid userId, Guid chatId, RegenerateResponseRequest request),
                RegenerateResponseCommand
            >()
            .Map(dest => dest.UserId, src => src.userId)
            .Map(dest => dest.ChatId, src => src.chatId)
            .Map(dest => dest.Model, src => src.request.Model)
            .Map(dest => dest.DisplayedMessageIds, src => src.request.DisplayedMessageIds);
    }
}
