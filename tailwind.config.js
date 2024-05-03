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
  daisyui: {
    themes: [
      // "light",
      // "dark",
      {
        'light': {
           'primary' : '#570df8',           /* Primary color */
           'primary-focus' : '#4506cb',     /* Primary color - focused */
           'primary-content' : '#ffffff',   /* Foreground content color to use on primary color */

           'secondary' : '#f000b8',         /* Secondary color */
           'secondary-focus' : '#bd0091',   /* Secondary color - focused */
           'secondary-content' : '#ffffff', /* Foreground content color to use on secondary color */

           'accent' : '#37cdbe',            /* Accent color */
           'accent-focus' : '#2ba69a',      /* Accent color - focused */
           'accent-content' : '#ffffff',    /* Foreground content color to use on accent color */

           'neutral' : '#3b424e',           /* Neutral color */
           'neutral-focus' : '#2a2e37',     /* Neutral color - focused */
           'neutral-content' : '#ffffff',   /* Foreground content color to use on neutral color */

           'base-100' : '#ffffff',          /* Base color of page, used for blank backgrounds */
           'base-200' : '#f9fafb',          /* Base color, a little darker */
           'base-300' : '#ced3d9',          /* Base color, even more darker */
           'base-content' : '#1e2734',      /* Foreground content color to use on base color */

           'info' : '#1c92f2',              /* Info */
           'success' : '#009485',           /* Success */
           'warning' : '#ff9900',           /* Warning */
           'error' : '#ff5724',             /* Error */

          '--rounded-box': '0.65rem',          /* border-radius for cards and other big elements */
          '--rounded-btn': '0.65rem',        /* border-radius for buttons and similar elements */
          '--rounded-badge': '0.65rem',      /* border-radius for badge and other small elements */

          '--animation-btn': '.25s',       /* bounce animation time for button */
          '--animation-input': '.2s',       /* bounce animation time for checkbox, toggle, etc */

          '--btn-text-case': 'uppercase',   /* default text case for buttons */
          '--navbar-padding': '.5rem',      /* default padding for navbar */
          '--border-btn': '1px',            /* default border size for button */
        },
      },
      {
        'dark': {
          ...require("daisyui/src/theming/themes")["dark"],
          '--rounded-box': '0.65rem',          /* border-radius for cards and other big elements */
          '--rounded-btn': '0.65rem',        /* border-radius for buttons and similar elements */
          '--rounded-badge': '0.65rem',      /* border-radius for badge and other small elements */

          '--animation-btn': '.25s',       /* bounce animation time for button */
          '--animation-input': '.2s',       /* bounce animation time for checkbox, toggle, etc */

          '--btn-text-case': 'uppercase',   /* default text case for buttons */
          '--navbar-padding': '.5rem',      /* default padding for navbar */
          '--border-btn': '1px',            /* default border size for button */
        },
      },
    ],
  },
}