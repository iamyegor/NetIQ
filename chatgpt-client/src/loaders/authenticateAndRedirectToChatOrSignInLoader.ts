import { redirect } from "react-router-dom";
import fetchAuthStatus from "@/utils/services/fetchAuthStatus.ts";

export default async function authenticateAndRedirectToChatOrSignInLoader() {
    try {
        await fetchAuthStatus();
        return redirect("/chat");
    } catch (e) {
        return redirect("/sign-in");
    }
}
