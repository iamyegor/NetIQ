using Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users").HasKey(user => user.Id);

        builder.Property(user => user.Id).HasColumnName("id").ValueGeneratedNever();
        builder.HasMany(user => user.Chats).WithOne().HasForeignKey(c => c.UserId);
        builder.ComplexProperty(
            user => user.Email,
            eBuilder =>
            {
                eBuilder.Property(x => x.Value).HasColumnName("email");
            }
        );
        builder.ComplexProperty(
            x => x.SubscriptionStatus,
            sBuilder =>
            {
                sBuilder.Property(s => s.Value).HasColumnName("subscription_status");
            }
        );
    }
}
