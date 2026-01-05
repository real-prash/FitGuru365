// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    // ... content array ...
  theme: {
    // ... theme settings ...
  },
  plugins: [require("tailwindcss-animate")], // <--- Make sure this line exists and is spelled correctly
};
export default config;