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

        builder.Property(user => user.StripeCustomerId).HasColumnName("stripe_customer_id");
        builder.HasOne(user => user.Subscription).WithMany().HasForeignKey("subscription_id");

        builder.Property(user => user.SentMessages).HasColumnName("sent_messages");
    }
}
