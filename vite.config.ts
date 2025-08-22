import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import viteTsconfigPaths from "vite-tsconfig-paths"
import svgrPlugin from "vite-plugin-svgr"
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    // Only enable bundle visualizer when ANALYZE_BUNDLE env var is set
    ...(process.env.ANALYZE_BUNDLE === "true"
      ? [
          visualizer({
            open: true,
            filename: "dist/stats.html",
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  build: {
    chunkSizeWarningLimit: 1000, // 1MB limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          // Redux toolkit
          redux: ["@reduxjs/toolkit", "react-redux"],
          // Utility libraries
          utils: ["moment", "lodash"],
          // Data grid
          dataGrid: ["@mui/x-data-grid"],
          // Chart libraries
          charts: ["react-apexcharts", "apexcharts", "klinecharts"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@mui/material",
      "@mui/icons-material",
    ],
  },
})
