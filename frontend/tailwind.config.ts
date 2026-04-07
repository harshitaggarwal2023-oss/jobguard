import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: "#6366f1",
          glow: "rgba(99, 102, 241, 0.35)",
        },
        cyan: { DEFAULT: "#06b6d4" },
        rose: { DEFAULT: "#f43f5e" },
        emerald: { DEFAULT: "#10b981" },
        amber: { DEFAULT: "#f59e0b" },
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        squircle: "28%",
      },
    },
  },
  plugins: [],
};
export default config;
