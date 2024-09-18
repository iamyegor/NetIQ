using Domain.Chat;
using Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ChatConfiguration : IEntityTypeConfiguration<Chat>
{
    public void Configure(EntityTypeBuilder<Chat> builder)
    {
        builder.ToTable("chats").HasKey(chat => chat.Id);

        builder.Property(chat => chat.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(chat => chat.Title).HasColumnName("title");
        builder.Property(chat => chat.UserId).HasColumnName("user_id");
        builder
            .HasMany(chat => chat.Messages)
            .WithOne()
            .HasForeignKey("chat_id")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
