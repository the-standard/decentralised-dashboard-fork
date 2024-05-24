/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  plugins: [
    require("daisyui"),
    require('@tailwindcss/typography')
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  daisyui: {
    themes: [
      {
        'deluxe-light': {
          ...require("daisyui/src/theming/themes")["light"],
          'primary' : '#d4af37',
          'base-content' : 'rgba(0,0,0,0.8)',
        },
      },
      {
        'deluxe-dark': {
          ...require("daisyui/src/theming/themes")["dark"],
          'primary' : '#d4af37',
          'base-content' : 'rgba(255,255,255,0.8)',
        },
      },
      {
        'nebula-light': {
          ...require("daisyui/src/theming/themes")["light"],
          'primary' : '#5617de',
          'base-content' : 'rgba(0,0,0,0.8)',
        },
      },
      {
        'nebula-dark': {
          ...require("daisyui/src/theming/themes")["dark"],
          'primary' : '#5617de',
          'base-content' : 'rgba(255,255,255,0.8)',
        },
      },
    ],
  },
}