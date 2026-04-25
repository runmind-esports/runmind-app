import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--foreground-muted)',
        },
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          dim: 'var(--accent-dim)',
        },
        bubble: {
          user: 'var(--bubble-user)',
          assistant: 'transparent',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-bg)',
        },
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'message': ['15px', '1.6'],
        'timestamp': ['13px', '1.4'],
      },
      maxWidth: {
        'chat': '48rem',
      },
      borderRadius: {
        'bubble': '1.5rem',
        'input': '1.5rem',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'slide-in-left': 'slide-in-left 300ms ease-out',
        'option-fade-in': 'option-fade-in 300ms ease-out forwards',
        'scale-bounce': 'scale-bounce 250ms ease-out',
        'fade-in-up': 'fade-in-up 400ms ease-out',
        'progress-spring': 'progress-spring 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'check-pop': 'check-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'button-press': 'button-press 150ms ease-in-out',
        'success-check': 'success-check 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'option-fade-in': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-bounce': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1.02)' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'progress-spring': {
          '0%': { transform: 'scaleX(var(--progress-from, 0))', transformOrigin: 'left' },
          '60%': { transform: 'scaleX(var(--progress-overshoot, 1.03))', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        'check-pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'button-press': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        'success-check': {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '50%': { transform: 'scale(1.15) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
