import { redirect } from "react-router-dom";
import fetchAuthStatus from "@/utils/services/fetchAuthStatus.ts";

export default async function redirectToSignInOnUnauthenticatedLoader() {
    try {
        await fetchAuthStatus();
        return null;
    } catch (e) {
        return redirect("/sign-in");
    }
}
