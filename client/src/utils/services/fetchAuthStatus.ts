import authApi from "@/lib/backend/authApi";

export default async function fetchAuthStatus() {
    await authApi.get("user/is-authenticated");
}
