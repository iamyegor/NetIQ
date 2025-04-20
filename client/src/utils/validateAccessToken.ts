function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export function validateAccessToken(token: string | undefined) {
    if (!token) return false;

    const parsedToken = parseJwt(token);
    if (!parsedToken) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return parsedToken.exp > currentTime;
}