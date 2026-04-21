/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ---------- FONTS ---------- */
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
      },

      /* ---------- COLORS ---------- */
      colors: {
        neon: {
          blue: "#00f0ff",
        },

        electric: {
          purple: "#a855f7",
        },

        zinc: {
          950: "#09090b",
        },
      },

      /* ---------- SHADOWS ---------- */
      boxShadow: {
        neon:
          "0 0 30px rgba(0,240,255,0.22), 0 0 80px rgba(0,240,255,0.08)",

        "neon-purple":
          "0 0 30px rgba(168,85,247,0.22), 0 0 80px rgba(168,85,247,0.08)",

        glow:
          "0 20px 80px rgba(0,0,0,0.45)",
      },

      /* ---------- BACKGROUNDS ---------- */
      backgroundImage: {
        radial:
          "radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 65%)",

        mesh:
          "linear-gradient(135deg, rgba(0,240,255,0.08), transparent 40%, rgba(168,85,247,0.08))",
      },

      /* ---------- SPACING ---------- */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      /* ---------- BORDER RADIUS ---------- */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      /* ---------- ANIMATION ---------- */
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },

        pulseGlow: {
          "0%, 100%": {
            opacity: "0.45",
          },
          "50%": {
            opacity: "1",
          },
        },

        slowSpin: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "pulseGlow 4s ease-in-out infinite",
        spinSlow: "slowSpin 18s linear infinite",
      },

      /* ---------- BREAKPOINTS ---------- */
      screens: {
        xs: "480px",
        "3xl": "1800px",
      },

      /* ---------- MAX WIDTH ---------- */
      maxWidth: {
        "8xl": "1600px",
        "9xl": "1800px",
      },
    },
  },

  plugins: [],
};