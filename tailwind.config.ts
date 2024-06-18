import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0400F5", // Blue
        secondary: "#8CFB51", // Lime Green
        pink: "#FF69B4", // Hot Pink
        darkBg: "#1E1E24", // Raisin Black
        darkCard: "#1E1E24", // Raisin Black (same for card background)
        white: "#FFFFFF",
        grey: "#758096",
      },
      fontFamily: {
        sans: ["SF Pro", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
};
export default config;
