import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                mono: ["Jetbrains Mono", defaultTheme.fontFamily.mono],
            },
            screens: {
                xs: "420px",
                sm: "600px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                "faded": "#BCBCBC"
            },
        },
        container: {
            center: "true",
            padding: "20px",
            screens: {
                sm: "1240px",
                md: "1240px",
                lg: "1240px",
                xl: "1240px",
                "2xl": "1700px",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
