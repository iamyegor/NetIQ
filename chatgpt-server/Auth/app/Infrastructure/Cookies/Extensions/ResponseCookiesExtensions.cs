using Infrastructure.Auth.Authentication;
using Microsoft.AspNetCore.Http;
using SharedKernel.Auth;

namespace Infrastructure.Cookies.Extensions;

public static class ResponseCookiesExtensions
{
    public static void Append(this IResponseCookies cookies, Tokens tokens)
    {
        cookies.Append(
            CookiesInfo.AccessToken.Name,
            tokens.AccessToken,
            CookiesInfo.AccessToken.Options
        );
        cookies.Append(
            CookiesInfo.RefreshToken.Name,
            tokens.RefreshToken,
            CookiesInfo.RefreshToken.Options
        );
    }
}
