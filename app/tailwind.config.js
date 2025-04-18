/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#d6e0fd',
          300: '#b5c6fb',
          400: '#8fa3f8',
          500: '#6c7ff4',
          600: '#5362e9',
          700: '#4651d8',
          800: '#3a42af',
          900: '#343b8e',
          950: '#23265a',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'var(--tw-prose-links)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px',
              fontWeight: '500',
              '&:hover': {
                color: 'var(--tw-prose-links-hover)',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'inherit',
              marginTop: '2em',
              marginBottom: '1em',
            },
            h1: {
              fontSize: '2.5em',
            },
            h2: {
              fontSize: '1.875em',
            },
            h3: {
              fontSize: '1.5em',
            },
            code: {
              color: 'var(--tw-prose-code)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}