/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f6f9',
          100: '#f4eff4',
          200: '#ebdfea',
          300: '#dbc6d8',
          400: '#c5a1c0',
          500: '#b084a9',
          600: '#99698e',
          700: '#825476',
          800: '#714b67',
          900: '#5c3f55',
        }
      },
      fontFamily: {
        sans: ['Lexend Deca', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
