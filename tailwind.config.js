/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B8860B',
        background: {
          light: '#ffffff',
          dark: '#1A1A14',
        },
        surface: {
          light: '#ffffff',
          dark: '#2A2A1E',
        },
        text: {
          main: {
            light: '#1A1A14',
            dark: '#F5F0E0',
          },
          muted: {
            light: '#7A7A60',
            dark: '#C4B89A',
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: 'class',
}