export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0A1F44', dark: '#061232', light: '#1A3A6E' },
        gold:    { DEFAULT: '#F5A623', dark: '#D4891A', light: '#FFC04D' },
        dark:    { DEFAULT: '#111112', '2': '#18181A', '3': '#222224' },
        chrome:  { DEFAULT: '#F0F0F0', dim: '#8A8A90' },
        surface: '#2A2A2D',
      },
      fontFamily: {
        sans:  ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
