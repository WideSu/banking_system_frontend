/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          hover: '#0052a3',
        },
        success: {
          DEFAULT: '#28A745',
        },
        danger: {
          DEFAULT: '#DC3545',
        }
      }
    },
  },
  plugins: [],
};
