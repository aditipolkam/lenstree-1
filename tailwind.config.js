/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      'animation': {
        'bg': 'bg 5s ease infinite',
      },
      'keyframes': {
        'bg': {
          '0%, 100%': {
            "background-size": "10% 10%",
            'background-position': '10% 10%'
          },
          '50%': {
            'background-size': '100% 100%',
            'background-position': 'left center'
          }
        },
      },
      fontFamily: {
        "Josefin": ['Josefin Sans', "sans-serif"],
        "Lato": ['Lato', "sans-serif"]
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      }
    },
  },
  plugins: [],
} 