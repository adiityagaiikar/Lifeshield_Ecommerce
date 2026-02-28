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
          900: "#0a0b10",
          800: "#12141d",
        },
        primary: {
          violet: "#818cf8",
          emerald: "#34d399"
        },
        surface: {
          glass: "rgba(255, 255, 255, 0.03)"
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
        'glow-emerald': '0 0 30px rgba(52, 211, 153, 0.12)',
        'glow-emerald-hover': '0 0 50px rgba(52, 211, 153, 0.2)',
        'glow-violet': '0 0 40px rgba(99, 102, 241, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
