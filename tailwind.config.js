/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#008FD4',
          darkcyan: '#016EA3',
          navy: '#003C80',
          dark: '#0F172A',
          muted: '#475569',
          light: '#64748B',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        channel: {
          wa: '#25D366',
          ig: '#E1306C',
          web: '#008FD4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 60, 128, 0.05), 0 2px 4px -2px rgba(0, 60, 128, 0.05)',
        'float': '0 20px 25px -5px rgba(0, 60, 128, 0.10), 0 8px 10px -6px rgba(0, 60, 128, 0.10)',
      }
    },
  },
  plugins: [],
}
