/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: { provider: 'v8', include: ['src/app/**/*.ts'], exclude: ['src/app/**/*.spec.ts'] },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
