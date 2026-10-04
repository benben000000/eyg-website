/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: { 950: "#131417", 900: "#1C1E22", 700: "#2E3238" },
        steel: { 500: "#6B7280", 300: "#C8CDD4", 100: "#E8EAED" },
        paper: "#FFFFFF",
        offwhite: "#F6F3EC",
        amberbrand: { 600: "#C96A0A", 500: "#E8861A", 400: "#F5A524" },
        safety: "#D9480F",
        success: "#2F7D4F",
        danger: "#B42318",
        warningbg: "#FEF3C7"
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', '"Helvetica Neue Condensed"', "Arial", "sans-serif"],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', '"Liberation Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
