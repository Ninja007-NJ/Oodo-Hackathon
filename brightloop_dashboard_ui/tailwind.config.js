/** @type {import('tailwindcss').Config} */
// Accent colours are CSS variables (set by the theme picker), so every glow and button follows the chosen neon theme.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: { 900: v('n900'), 800: v('n800'), 700: v('n700') },     // chrome surfaces
        brand: { DEFAULT: v('brand'), hi: v('brand-hi'), dark: v('brand-dark'), light: v('brand-light') },
        glow: v('glow'),                                              // neon accent
        frost: v('frost'),                                            // card surfaces
        ink: { DEFAULT: v('ink'), soft: v('ink-soft') },                 // text on cards
        mist: v('mist'),                                              // text on chrome
        fog: v('fog'),                                                // secondary text on chrome
        line: v('line'),
        status: { covered: '#1E9E6A', partial: '#B87400', missing: '#6B7587', review: '#6D4DE8', danger: '#D64545' },
        lite: { covered: v('lite-covered'), partial: v('lite-partial'), missing: v('lite-missing'), review: v('lite-review') },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        grotesk: ['Space Grotesk', 'ui-sans-serif', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
        pixel: ['Silkscreen', 'Space Mono', 'monospace'],
      },
      borderRadius: { card: '20px' },
      boxShadow: {
        raise: '0 6px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.9)',
        lift: '0 14px 30px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.9)',
        card: '0 12px 32px rgba(0,0,0,0.35)',
        neon: '0 0 0 2px rgb(var(--glow) / 0.95), 0 0 calc(20px * var(--glow-i)) rgb(var(--glow) / calc(0.6 * var(--glow-i)))',
        blue: '0 8px 22px rgb(var(--brand) / 0.5)',
      },
      keyframes: {
        toast: { from: { opacity: '0', transform: 'translate(-50%, 12px)' }, to: { opacity: '1', transform: 'translate(-50%, 0)' } },
      },
      animation: { toast: 'toast 0.25s ease-out' },
    },
  },
  plugins: [],
}
