export default function getErrorBasedOnMessage(message: string) {
    if (message === "chat.reached.max.messages") {
        return "max_messages_error";
    } else if (message === "user.reached.message.limit") {
        return "subscription_max_messages_error";
    } else {
        return "generic_error";
    }
}
