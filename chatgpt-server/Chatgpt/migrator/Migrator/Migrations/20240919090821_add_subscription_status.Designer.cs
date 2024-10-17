// <auto-generated />
using System;
using System.Collections.Generic;
using Migrator;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20240919090821_add_subscription_status")]
    partial class add_subscription_status
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Domain.Chat.Chat", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("LastUpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("title");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("chats", (string)null);
                });

            modelBuilder.Entity("Domain.Chat.Entities.Message", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<bool>("IsSelected")
                        .HasColumnType("boolean")
                        .HasColumnName("is_selected");

                    b.Property<Guid?>("LinkId")
                        .HasColumnType("uuid")
                        .HasColumnName("link_id");

                    b.Property<Guid?>("chat_id")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("chat_id");

                    b.ToTable("messages", (string)null);
                });

            modelBuilder.Entity("Domain.User.User", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.ComplexProperty<Dictionary<string, object>>("Email", "Domain.User.User.Email#Email", b1 =>
                        {
                            b1.IsRequired();

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("email");
                        });

                    b.ComplexProperty<Dictionary<string, object>>("SubscriptionStatus", "Domain.User.User.SubscriptionStatus#SubscriptionStatus", b1 =>
                        {
                            b1.IsRequired();

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("subscription_status");
                        });

                    b.HasKey("Id");

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("Domain.Chat.Chat", b =>
                {
                    b.HasOne("Domain.User.User", null)
                        .WithMany("Chats")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Domain.Chat.Entities.Message", b =>
                {
                    b.HasOne("Domain.Chat.Chat", null)
                        .WithMany("Messages")
                        .HasForeignKey("chat_id")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.OwnsOne("Domain.Chat.Entities.Sender", "Sender", b1 =>
                        {
                            b1.Property<Guid>("MessageId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("sender_value");

                            b1.HasKey("MessageId");

                            b1.ToTable("messages");

                            b1.WithOwner()
                                .HasForeignKey("MessageId");
                        });

                    b.Navigation("Sender")
                        .IsRequired();
                });

            modelBuilder.Entity("Domain.Chat.Chat", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("Domain.User.User", b =>
                {
                    b.Navigation("Chats");
                });
#pragma warning restore 612, 618
        }
    }
}
