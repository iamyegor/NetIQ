type AppError =
    | "messages_error"
    | "generic_error"
    | "message_too_long"
    | "max_messages_error"
    | "subscription_max_messages_error";

export default AppError;
