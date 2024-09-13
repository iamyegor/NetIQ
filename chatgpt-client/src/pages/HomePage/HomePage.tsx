import { useState } from "react";

export default function HomePage() {
    const [response, setResponse] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const startStreaming = () => {
        setIsStreaming(true);
        setResponse("");

        const eventSource = new EventSource("https://localhost:7071/api/stream");

        eventSource.onmessage = (event) => {
            setResponse((prevResponse) => prevResponse + event.data);
        };

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
            setIsStreaming(false);
        };

        eventSource.addEventListener("close", () => {
            eventSource.close();
            setIsStreaming(false);
        });
    };

    return (
        <div className="p-4">
            <button
                onClick={startStreaming}
                disabled={isStreaming}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {isStreaming ? "Streaming..." : "Start Streaming"}
            </button>
            <div className="mt-4 p-4 border rounded">
                {response || "Response will appear here..."}
            </div>
        </div>
    );
}
