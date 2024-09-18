import fetchAuthStatus from "@/utils/services/fetchAuthStatus.ts";
import { redirect } from "react-router-dom";

export default async function authenticateAndRedirectToChatOrStayLoader() {
    try {
        await fetchAuthStatus();
        return redirect("/chat");
    } catch {
        return null;
    }
}
