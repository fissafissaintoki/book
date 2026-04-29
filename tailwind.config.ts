import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#12171f',
        metal: '#2a3340',
        steel: '#3f4d5c',
        cyanPulse: '#3ec8ff',
        electric: '#1c8dff',
      },
      boxShadow: {
        panel: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        metallic:
          'linear-gradient(145deg, rgba(63,77,92,0.26), rgba(42,51,64,0.6) 50%, rgba(18,23,31,0.8))',
      },
    },
  },
  plugins: [],
} satisfies Config;
