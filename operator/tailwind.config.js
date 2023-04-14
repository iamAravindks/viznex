/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        inputBorder: "#B6B6B6",
        linkColor: "#FFA800",
        signUpTextColor: "#8E8E8E",
        subText: "#6D6D6D",
        bgNavbar: "#39383F",
        textHead: "#C3C3C3",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
  },
};
