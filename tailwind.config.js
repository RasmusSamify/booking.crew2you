/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        bg: '#faf8f3',
        surface: '#ffffff',
        'surface-alt': '#f5f2ea',
        border: {
          DEFAULT: '#e8e2d4',
          strong: '#d4cdb8',
        },
        ink: {
          DEFAULT: '#1c1a15',
          soft: '#3d3930',
          muted: '#6b6656',
          faint: '#9c9581',
        },
        gold: {
          DEFAULT: '#c4a758',
          dark: '#a88c42',
          light: '#e8dcb8',
          bg: '#faf4e3',
        },
        // Status colors
        status: {
          inkommen: { DEFAULT: '#475569', bg: '#f1f5f9' },
          bokad: { DEFAULT: '#4c6ef5', bg: '#eef2ff' },
          bekraftad: { DEFAULT: '#7c3aed', bg: '#f3efff' },
          personal: { DEFAULT: '#db2777', bg: '#fdf2f8' },
          genomford: { DEFAULT: '#d97706', bg: '#fef7e6' },
          aterrapporterad: { DEFAULT: '#059669', bg: '#ecfdf5' },
          fakturerad: { DEFAULT: '#a88c42', bg: '#faf4e3' },
        },
        red: { DEFAULT: '#dc2626', bg: '#fef2f2' },
        green: { DEFAULT: '#059669', bg: '#ecfdf5' },
        amber: { DEFAULT: '#d97706', bg: '#fef7e6' },
        blue: { DEFAULT: '#4c6ef5', bg: '#eef2ff' },
        violet: { DEFAULT: '#7c3aed', bg: '#f3efff' },
        pink: { DEFAULT: '#db2777', bg: '#fdf2f8' },
      },
      boxShadow: {
        xs: '0 1px 2px rgba(28, 26, 21, 0.04)',
        sm: '0 1px 3px rgba(28, 26, 21, 0.06), 0 1px 2px rgba(28, 26, 21, 0.04)',
        md: '0 4px 12px rgba(28, 26, 21, 0.06), 0 2px 4px rgba(28, 26, 21, 0.04)',
        lg: '0 20px 40px rgba(28, 26, 21, 0.12), 0 4px 12px rgba(28, 26, 21, 0.06)',
      },
      borderRadius: {
        'r-sm': '6px',
        'r': '8px',
        'r-lg': '12px',
        'r-xl': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease',
        'slide-up': 'slideUp 0.2s ease',
        'pulse-gold': 'pulseGold 2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '30%': { transform: 'scale(1.3)' },
          '60%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
