/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        eloquiabold: ["EloquiaBold"],
        eloquialight: ["EloquiaLight"],
      },
    },
  },
  plugins: [require("daisyui")],
};
