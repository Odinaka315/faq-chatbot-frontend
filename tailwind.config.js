export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f1a",
        surface: "#111827",
        surface2: "#1a2235",
        border: "rgba(255,255,255,0.07)",
        navy: "#0D2149",
        gold: "#C9A84C",
        "gold-dim": "rgba(201,168,76,0.15)",
        "gold-glow": "rgba(201,168,76,0.25)",
        text: "rgba(255,255,255,0.88)",
        muted: "rgba(255,255,255,0.4)",
        dim: "rgba(255,255,255,0.12)",
      },
      // ... (fontFamily and width)
    },
  },
  plugins: [],
};
