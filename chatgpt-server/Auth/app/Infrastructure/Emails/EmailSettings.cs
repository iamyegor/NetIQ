namespace Infrastructure.Emails;

public class EmailSettings
{
    public string SenderName { get; set; }
    public string SenderEmail { get; set; }
    public string MailServer { get; set; }
    public int MailPort { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}
