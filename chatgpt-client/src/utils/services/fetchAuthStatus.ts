import authApi from "@/lib/authApi.ts";

export default async function fetchAuthStatus() {
    await authApi.get("user/is-authenticated");
}
