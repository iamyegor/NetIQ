import api from "@/lib/backend/api";

export default async function fetchData() {
    const { data } = await api.get("data");
    return data;
}
