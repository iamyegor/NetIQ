namespace Api.Dtos;

public class MessageDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public string Sender { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? LinkId { get; set; }
    public bool IsSelected { get; set; }
}
