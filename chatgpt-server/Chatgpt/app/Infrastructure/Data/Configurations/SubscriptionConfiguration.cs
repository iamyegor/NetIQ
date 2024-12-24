using Domain.User.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.HasKey(s => s.Id);
        builder.ToTable("subscriptions");

        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.Name).HasColumnName("name");
        builder.Property(s => s.Price).HasColumnName("price");
        builder.Property(s => s.MaxMessages).HasColumnName("max_messages");
        builder.Property(s => s.PriceIdDev).HasColumnName("price_id_dev");
        builder.Property(s => s.PriceIdProd).HasColumnName("price_id_prod");

        builder.HasData(Subscription.Plus);
    }
}
