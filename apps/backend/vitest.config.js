import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({
    test: {
        globals: true, // non serve importare { describe, it, expect }
        environment: 'node',
        include: ['tests/**/*.{test,spec}.{ts,js}'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts}', 'tests/**/*.{ts}'],
            exclude: ['src/**/*.d.ts', 'src/server.ts', 'src/**/*.test.ts'],
        },
        // Alias utili (stessi del tsconfig)
        alias: {
            '#': path.resolve(__dirname, '/src'),
            '#shared': path.resolve(__dirname, '../../packages/shared/src'),
        },
    },
    resolve: {
        alias: {
            '#': path.resolve(__dirname, '/src'),
            '#shared': path.resolve(__dirname, '../../packages/shared/src'),
        },
    },
});
