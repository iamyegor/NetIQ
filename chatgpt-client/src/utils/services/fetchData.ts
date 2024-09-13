import api from "@/lib/api.ts";

export default async function fetchData() {
    const { data } = await api.get("data");
    return data;
}
