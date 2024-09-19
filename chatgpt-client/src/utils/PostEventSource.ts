import authApi from "@/lib/authApi";

export default class PostEventSource {
    private url: string;
    private body: string;
    private abortController: AbortController | null = null;

    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((error: ErrorEvent) => void) | null = null;
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
            await this.fetchWithTokenRefresh();
        } catch (error: any) {
            if (error.name === "AbortError") {
                this.onclose?.();
            } else {
                console.error("PostEventSource error:", error);
                if (this.onerror) {
                    const errorEvent = new ErrorEvent("error", {
                        error,
                        message: error.message || "Unknown error occurred",
                    });
                    this.onerror(errorEvent);
                }
            }
        }
    }

    private async fetchWithTokenRefresh(isRetry: boolean = false): Promise<void> {
        try {
            const response = await fetch(
                `https://${import.meta.env.VITE_BACKEND_ADDRESS}/api/${this.url}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "text/event-stream",
                    },
                    body: JSON.stringify(this.body),
                    signal: this.abortController!.signal,
                    credentials: "include",
                },
            );

            if (response.status === 401 && !isRetry) {
                const refreshResult = await this.refreshToken();
                if (refreshResult) {
                    return this.fetchWithTokenRefresh(true);
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (!response.body) {
                throw new Error("ReadableStream not supported");
            }

            await this.handleStream(response.body);
        } catch (error) {
            throw error;
        }
    }

    private async handleStream(body: ReadableStream<Uint8Array>) {
        const reader = body.getReader();
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
                    } else if (eventType === "error" && this.onerror) {
                        const errorEvent = new ErrorEvent("error", {
                            message: data,
                        });
                        this.onerror(errorEvent);
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
    }

    private async refreshToken(): Promise<boolean> {
        try {
            await authApi.post("refresh-access-token");
            return true;
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return false;
        }
    }

    close() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
}
