/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#A8763E",
          light: "#F7F3E3",
          dark: "#404E40",
        },
        gain: "#7CB518",
        loss: "#EF3054",
      },
    },
  },
  plugins: [],
};
