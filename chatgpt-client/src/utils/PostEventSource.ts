export default class PostEventSource {
    private url: string;
    private body: string;
    private abortController: AbortController | null = null;

    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((error: Event) => void) | null = null;
    onclose: (() => void) | null = null;

    constructor(url: string, body: string) {
        this.url = url;
        this.body = body;
    }

    open() {
        this.close();
        this.connect();
    }

    private async connect() {
        this.abortController = new AbortController();

        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify(this.body),
                signal: this.abortController.signal,
                credentials: "include",
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            if (!response.body) throw new Error("ReadableStream not supported");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");
                let eventType = "message";
                let data = "";

                for (const line of lines) {
                    if (line.startsWith("event:")) {
                        eventType = line.slice(6).trim();
                    } else if (line.startsWith("data:")) {
                        data = line.slice(5).trim();
                    } else if (line === "" && data) {
                        if (eventType === "close") {
                            this.onclose?.();
                            return;
                        } else if (eventType === "message" && this.onmessage) {
                            const event = new MessageEvent("message", { data });
                            this.onmessage(event);
                        }
                        eventType = "message";
                        data = "";
                    }
                }
            }

            this.onclose?.();
        } catch (error: any) {
            if (error.name === "AbortError") {
                this.onclose?.();
            } else {
                console.error("PostEventSource error:", error);
                if (this.onerror) {
                    this.onerror(new Event("error"));
                }
            }
        }
    }

    close() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
}
