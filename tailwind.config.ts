import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-gold": "#f4c95d",
        "brand-rose": "#f4a7a0",
        "brand-slate": "#1f2933"
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
