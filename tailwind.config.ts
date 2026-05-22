import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Moriche custom palette
        crimson: {
          50:  "#fff1f1",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ff9a9a",
          400: "#ff5e5e",
          500: "#ff2929",
          600: "#ed1111",
          700: "#c80d0d",
          800: "#a50f0f",
          900: "#881414",
          950: "#4b0404",
        },
        gunmetal: {
          50:  "#f5f6f7",
          100: "#e8eaed",
          200: "#d0d4da",
          300: "#adb4be",
          400: "#838d9c",
          500: "#657080",
          600: "#515b6a",
          700: "#434b57",
          800: "#3a404b",
          900: "#333841",
          950: "#1a1d23",
        },
        charcoal: {
          900: "#0d0d0f",
          800: "#121215",
          700: "#18181c",
          600: "#1e1e24",
          500: "#26262e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        mono: ["var(--font-jetbrains)", ...fontFamily.mono],
        display: ["var(--font-rajdhani)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(220, 38, 38, 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "scan-line": "scan-line 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        "border-flow": "border-flow 3s ease infinite",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "crimson-glow":
          "radial-gradient(circle at center, rgba(220,38,38,0.15) 0%, transparent 70%)",
        "hero-gradient":
          "linear-gradient(135deg, #0d0d0f 0%, #18181c 50%, #1a0505 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        crimson: "0 0 30px rgba(220, 38, 38, 0.4)",
        "crimson-sm": "0 0 15px rgba(220, 38, 38, 0.25)",
        "inner-glow": "inset 0 0 30px rgba(220, 38, 38, 0.05)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-lg": "0 24px 64px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
