/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        poppins: ["Poppins"],
        JakartaSans: ["Plus Jakarta Sans"],
        Raleway: ["Raleway"],
      },
    },
  },
  plugins: [],
};
