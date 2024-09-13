﻿using Api.Dtos;
using Domain.User;
using Mapster;

namespace Api.Mappings;

public class MessageMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Message, MessageDto>().Map(dest => dest.Sender, src => src.Sender.Value);
    }
}
