﻿// <auto-generated />
using System;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    partial class ApplicationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Domain.User.Chat", b =>
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

                    b.Property<Guid?>("user_id")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("user_id");

                    b.ToTable("chats", (string)null);
                });

            modelBuilder.Entity("Domain.User.Message", b =>
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

                    b.HasKey("Id");

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("Domain.User.Chat", b =>
                {
                    b.HasOne("Domain.User.User", null)
                        .WithMany("Chats")
                        .HasForeignKey("user_id");
                });

            modelBuilder.Entity("Domain.User.Message", b =>
                {
                    b.HasOne("Domain.User.Chat", null)
                        .WithMany("Messages")
                        .HasForeignKey("chat_id");

                    b.OwnsOne("Domain.User.Sender", "Sender", b1 =>
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

            modelBuilder.Entity("Domain.User.Chat", b =>
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
