/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      colors: {
        coffee: {
          50:  '#fdf6f0',
          100: '#f5e6d8',
          200: '#e8c9ad',
          300: '#d9a87c',
          400: '#c8874e',
          500: '#b56b30',
          600: '#8f5224',
          700: '#6b3c1a',
          800: '#472711',
          900: '#2a1609',
        },
        clinic: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        medblue: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      }
    },
  },
  plugins: [],
}
