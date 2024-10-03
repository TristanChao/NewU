/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      small: '425px',
      // => @media (min-width: 425px) { ... }
      med: '700px',
      // => @media (min-width: 700px) { ... }
    },
  },
  plugins: [],
};
