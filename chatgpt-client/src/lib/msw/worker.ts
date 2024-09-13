import { setupWorker } from "msw/browser";
import { handlers } from "@/lib/msw/handlers.ts";

export const worker = setupWorker(...handlers);
