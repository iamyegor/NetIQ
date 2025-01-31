using Flurl.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Emails;

public class EmailSender
{
    private readonly EmailSettings _emailSettings;
    private const string ResendApiUrl = "https://api.resend.com/emails";

    public EmailSender(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendAsync(string subject, string html, string recipient)
    {
        var request = new
        {
            from = $"{_emailSettings.SenderName} <{_emailSettings.SenderEmail}>",
            to = new[] { recipient },
            subject,
            html
        };

        await ResendApiUrl
            .WithHeader("Authorization", $"Bearer {_emailSettings.ResendApiKey}")
            .PostJsonAsync(request);
    }
}
