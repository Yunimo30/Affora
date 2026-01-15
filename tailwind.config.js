/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        affora: {
          primary: '#5B9BD5',    // The specific Brand Blue
          light: '#A9D0F5',      // The lighter blue for backgrounds
          bg: '#EDF6FF',         // The very pale page background
          text: '#333333',       // Dark Gray text
        }
      },
      borderRadius: {
        'card': '1.25rem',       // 20px rounded corners (matches mockups)
        'pill': '9999px',        // Full rounded for buttons
      }
    },
  },
  plugins: [],
}