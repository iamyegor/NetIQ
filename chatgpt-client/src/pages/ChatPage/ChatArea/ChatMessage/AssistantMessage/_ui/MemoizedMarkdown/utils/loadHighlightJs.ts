let highlightJsThemeLoaded = false;
let highlightJsImportPromise: Promise<typeof import("highlight.js/lib/core")> | null = null;

export default function loadHighlightJs() {
    if (!highlightJsImportPromise) {
        if (!highlightJsThemeLoaded) {
            highlightJsImportPromise = import("highlight.js/styles/atom-one-dark.css")
                .then(() => {
                    highlightJsThemeLoaded = true;
                    return import("highlight.js/lib/core");
                })
                .then(async (hljs) => {
                    const core = hljs.default;

                    const languages = [
                        import("highlight.js/lib/languages/javascript").then((m) => ({
                            name: "javascript",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/typescript").then((m) => ({
                            name: "typescript",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/python").then((m) => ({
                            name: "python",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/java").then((m) => ({
                            name: "java",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/c").then((m) => ({
                            name: "c",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/cpp").then((m) => ({
                            name: "cpp",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/csharp").then((m) => ({
                            name: "csharp",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/go").then((m) => ({
                            name: "go",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/rust").then((m) => ({
                            name: "rust",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/php").then((m) => ({
                            name: "php",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/ruby").then((m) => ({
                            name: "ruby",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/swift").then((m) => ({
                            name: "swift",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/kotlin").then((m) => ({
                            name: "kotlin",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/dart").then((m) => ({
                            name: "dart",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/objectivec").then((m) => ({
                            name: "objectivec",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/bash").then((m) => ({
                            name: "bash",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/shell").then((m) => ({
                            name: "shell",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/powershell").then((m) => ({
                            name: "powershell",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/xml").then((m) => ({
                            name: "xml",
                            module: m.default,
                        })), // HTML uses XML
                        import("highlight.js/lib/languages/css").then((m) => ({
                            name: "css",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/scss").then((m) => ({
                            name: "scss",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/less").then((m) => ({
                            name: "less",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/sql").then((m) => ({
                            name: "sql",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/json").then((m) => ({
                            name: "json",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/yaml").then((m) => ({
                            name: "yaml",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/ini").then((m) => ({
                            name: "ini",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/xml").then((m) => ({
                            name: "xml",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/markdown").then((m) => ({
                            name: "markdown",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/graphql").then((m) => ({
                            name: "graphql",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/dockerfile").then((m) => ({
                            name: "dockerfile",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/makefile").then((m) => ({
                            name: "makefile",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/nginx").then((m) => ({
                            name: "nginx",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/ini").then((m) => ({
                            name: "ini",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/properties").then((m) => ({
                            name: "properties",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/lua").then((m) => ({
                            name: "lua",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/perl").then((m) => ({
                            name: "perl",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/haskell").then((m) => ({
                            name: "haskell",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/scala").then((m) => ({
                            name: "scala",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/r").then((m) => ({
                            name: "r",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/julia").then((m) => ({
                            name: "julia",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/vbnet").then((m) => ({
                            name: "vbnet",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/elixir").then((m) => ({
                            name: "elixir",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/protobuf").then((m) => ({
                            name: "protobuf",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/wasm").then((m) => ({
                            name: "wasm",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/latex").then((m) => ({
                            name: "latex",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/diff").then((m) => ({
                            name: "diff",
                            module: m.default,
                        })),
                        import("highlight.js/lib/languages/plaintext").then((m) => ({
                            name: "plaintext",
                            module: m.default,
                        })),
                    ];

                    await Promise.all(languages).then((results) => {
                        results.forEach(({ name, module }) => {
                            core.registerLanguage(name, module);
                        });
                    });

                    return hljs;
                })
                .catch((error) => {
                    highlightJsImportPromise = null;
                    console.error("Failed to load highlight.js resources", error);
                    throw error;
                });
        } else {
            highlightJsImportPromise = import("highlight.js/lib/core").catch((error) => {
                highlightJsImportPromise = null;
                console.error("Failed to load highlight.js", error);
                throw error;
            });
        }
    }
    return highlightJsImportPromise;
}