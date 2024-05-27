/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    fontSize: {
      x: "0.5rem",
      "2x": "0.75rem",
      "3x": "1rem",
      "4x": "1.25rem",
      "5x": "1.5rem",
      "6x": "1.75rem",
      "7x": "2rem",
      "8x": "2.25rem",
    },
    extend: {
      fontFamily: {
        eloquiabold: ["EloquiaBold"],
        eloquialight: ["EloquiaLight"],
      },
    },
  },
  plugins: [require("daisyui")],
};
