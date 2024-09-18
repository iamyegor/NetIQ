using Domain.Chat;
using Domain.User;

namespace Api.Dtos;

public class ChatsResponseDto
{
    public int? NextPageNumber { get; set; }
    public List<Chat> Chats { get; set; } = [];
}