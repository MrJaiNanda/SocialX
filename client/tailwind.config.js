/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // A small, deliberate palette used throughout the app.
        // "ink" is near-black for text (high contrast on white),
        // "brand" is the primary action color, "accent" is used sparingly
        // for likes/highlights, and "surface"/"muted" are backgrounds.
        ink: "#14171F",
        brand: {
          DEFAULT: "#2D5BFF",
          dark: "#1E3FCC",
          light: "#E8EDFF",
        },
        accent: {
          DEFAULT: "#E1493C",
          light: "#FDECEA",
        },
        surface: "#FFFFFF",
        muted: "#F4F5F7",
        border: "#E3E5EA",
        subtext: "#5B6072",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
