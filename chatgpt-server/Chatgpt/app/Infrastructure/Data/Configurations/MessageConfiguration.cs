using Domain.Chat.Entities;
using Domain.Chat.Entities.Message;
using Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("messages").HasKey(message => message.Id);

        builder.Property(message => message.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(message => message.Content).HasColumnName("content");
        builder.Property(message => message.CreatedAt).HasColumnName("created_at");
        builder.Property(m => m.LinkId).HasColumnName("link_id");
        builder.Property(m => m.IsSelected).HasColumnName("is_selected");
        builder.OwnsOne(
            message => message.Sender,
            sb =>
            {
                sb.Property(sender => sender.Value).HasColumnName("sender_value");
            }
        );
    }
}
