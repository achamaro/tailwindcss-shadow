import { coloredShadow, shadowColor } from "@achamaro/tailwindcss-shadow";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [shadowColor(), coloredShadow()],
};
