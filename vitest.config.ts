import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/image': path.resolve(__dirname, './src/test-utils/nextImageMock.tsx'),
      'next/link': path.resolve(__dirname, './src/test-utils/nextLinkMock.tsx'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    exclude: ['node_modules/**', 'e2e/**', '.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'e2e/**',
        '.next/**',
        '**/*.config.*',
        '**/*.d.ts',
        'src/app/(payload)/**',
        'src/lib/payload.config.ts',
      ],
    },
  },
});
