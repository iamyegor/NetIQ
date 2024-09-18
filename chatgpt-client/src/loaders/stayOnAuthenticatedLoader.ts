import { redirect } from "react-router-dom";
import fetchAuthStatus from "@/utils/services/fetchAuthStatus.ts";

export default async function stayOnAuthenticatedLoader() {
    try {
        await fetchAuthStatus();
        redirect("/");
    } catch {
        return null;
    }
}
