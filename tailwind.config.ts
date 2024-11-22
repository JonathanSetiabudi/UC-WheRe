import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ucwhere:{
          "light-blue": "#9DBBD7", 
          blue: "#6584A8",
          yellow: "#FFF8D2",
          orange: "#FFCA81",
          red: "#FF7A7A",
          green: "#99C399",
        },
      },
      fontFamily:{
        jersey: ["var(--font-jersey25)"],
      }
    },
  },
  plugins: [],
};
export default config;
