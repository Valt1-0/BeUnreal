/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    fontSize: {
      x: "0.5rem",
      "2x": "0.75rem",
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
