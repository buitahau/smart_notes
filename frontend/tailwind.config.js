/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./entrypoints/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'popup': '360px',
      },
      maxHeight: {
        'popup': '720px',
      },
    },
  },
  plugins: [],
};