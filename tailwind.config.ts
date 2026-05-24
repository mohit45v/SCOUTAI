import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          hover: 'var(--bg-hover)',
        },
        brand: {
          green: 'var(--brand-green)',
          'green-dim': 'var(--brand-green-dim)',
          amber: 'var(--brand-amber)',
          red: 'var(--brand-red)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          disabled: 'var(--text-disabled)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          active: 'var(--border-active)',
        },
        chip: {
          bat: 'var(--chip-bat)',
          bowl: 'var(--chip-bowl)',
          all: 'var(--chip-all)',
          wk: 'var(--chip-wk)',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.0, 0.0, 0.2, 1) forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(57, 255, 20, 0.2)' },
          '50%': { boxShadow: '0 0 15px rgba(57, 255, 20, 0.6)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config
