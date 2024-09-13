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
        builder.HasMany(chat => chat.Messages).WithOne().HasForeignKey("chat_id");
    }
}
