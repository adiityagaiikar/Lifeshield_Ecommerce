import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        void: {
          900: "#050505",
          800: "#0f111a",
        },
        primary: {
          violet: "#4c1d95",
          emerald: "#064e3b"
        },
        surface: {
          glass: "rgba(255, 255, 255, 0.02)"
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 40px rgba(52, 211, 153, 0.1)',
        'glow-emerald-hover': '0 0 60px rgba(52, 211, 153, 0.25)',
        'glow-violet': '0 0 40px rgba(139, 92, 246, 0.1)',
      }
    },
  },
  plugins: [],
};
export default config;
