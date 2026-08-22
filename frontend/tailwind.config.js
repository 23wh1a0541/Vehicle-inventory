/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102033',
        accent: '#e45b3f',
        mist: '#f7f5f2',
      },
    },
  },
  plugins: [],
}
