import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'cupcake',
      'dark',
      'emerald',
      'cyberpunk',
      'valentine',
      'lofi',
      'dracula',
      'cmyk',
      'business',
      'winter',
    ],
    darkTheme: 'dracula',
  },
};
