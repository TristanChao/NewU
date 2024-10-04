/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
    screens: {
      small: '425px',
      // => @media (min-width: 425px) { ... }
      med: '700px',
      // => @media (min-width: 700px) { ... }
      big: '1500px',
      // => @media (min-width: 1000px) { ... }
    },
  },
  plugins: [],
};
