﻿using Domain.Common;

namespace Domain.Chat.Entities.Message;

public class Message : AggregateRoot<Guid>
{
    public string Content { get; private set; }
    public Sender Sender { get; }
    public DateTime CreatedAt { get; set; }
    public Guid? LinkId { get; }
    public bool IsSelected { get; private set; }

    public Message(string content, Sender sender, Guid? linkId)
        : base(Guid.NewGuid())
    {
        Content = content;
        Sender = sender;
        CreatedAt = DateTime.UtcNow;
        LinkId = linkId;
    }

    private Message()
        : base(Guid.NewGuid()) { }

    public void AppendContent(string content)
    {
        Content += content;
    }

    public void Unselect() => IsSelected = false;

    public void Select() => IsSelected = true;
}
