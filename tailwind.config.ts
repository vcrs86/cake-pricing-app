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
    "brand-cream": "#fbf7f3",
    "brand-peach": "#f6e7df",
    "brand-rose": "#d7a6b6",
    "brand-slate": "#1f2933",
    "brand-ink": "#111827"
  },
  boxShadow: {
    card: "0 10px 30px rgba(0,0,0,0.08)",
  },
},
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
