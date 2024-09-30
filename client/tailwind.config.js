/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      big: '425px',
      // => @media (min-width: 425px) { ... }
    },
  },
  plugins: [],
};
