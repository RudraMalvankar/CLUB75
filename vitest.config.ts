import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["database/tests/**/*.test.ts", "engine/**/*.test.ts"],
    testTimeout: 15_000,
    hookTimeout: 15_000,
    server: {
      deps: {
        inline: ["expo-sqlite"],
        external: ["react-native", "react"],
      },
    },
  },
});
