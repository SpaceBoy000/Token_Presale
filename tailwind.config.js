/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#37012B",
        primarybg: "#290120",
      },
      fontFamily: {
        jone: ["Space Grotesk"],
      },
      backgroundImage: {
        btngrad: "linear-gradient(87.03deg, #1EF1A5 -0.04%, #9746FE 99.96%)",
        tabgrad: "linear-gradient(90deg, #22EAA8 2.04%, #944AFC 100%)",
      },
    },
    screens: {
      'xxl': {'max': '1439px'},
      // => @media (max-width: 1439px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }

      'xsm': {'max': '399px'},
      // => @media (max-width: 399px) { ... }
    }
  },
  plugins: [],
};
