import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler"]],
            },
        }),
        visualizer({ open: true }),
        svgr(),
    ],
    server: {
        host: "0.0.0.0",
        port: 80,
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [fixReactVirtualized],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
