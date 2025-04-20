export default class RouteError extends Error {
    title: string;

    private constructor(title: string, message: string) {
        super(message);
        this.title = title;
    }

    static notFound(): RouteError {
        const errorTitle =
            window.uiLanguage === "en" ? "404 - Page not found" : "404 - Страница не найдена";
        const errorMessage =
            window.uiLanguage === "en"
                ? "The chat or page you are looking for does not exist."
                : "Упс! Чат или страница, которую вы ищете, не существует.";

        return new RouteError(errorTitle, errorMessage);
    }

    static unexpected(): RouteError {
        const errorTitle =
            window.uiLanguage === "en" ? "Something went wrong" : "Что-то пошло не так";
        const errorMessage =
            window.uiLanguage === "en"
                ? "Please try again later"
                : "Пожалуйста, попробуйте еще раз.";

        return new RouteError(errorTitle, errorMessage);
    }

    static serverError(): RouteError {
        const errorTitle = window.uiLanguage === "en" ? "500! Server error" : "500! Ошибка сервера";
        const errorMessage =
            window.uiLanguage === "en"
                ? "The server is experiencing an error. Please try again later."
                : "Ошибка на нашей стороне. Пожалуйста, попробуйте позже.";

        return new RouteError(errorTitle, errorMessage);
    }
}
