/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sim: {
          bg: "#0B0F17",
          panel: "#111827",
          card: "#161F30",
          cardHover: "#1C273C",
          border: "#1F2E45",
          borderLight: "#2D3F5D",
          text: "#E2E8F0",
          muted: "#94A3B8",
          dim: "#64748B",
          healthy: "#10B981",
          healthyBg: "#064E3B",
          failed: "#EF4444",
          failedBg: "#7F1D1D",
          affected: "#F59E0B",
          affectedBg: "#78350F",
          degraded: "#EAB308",
          degradedBg: "#713F12",
          accent: "#3B82F6",
          accentHover: "#2563EB"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
