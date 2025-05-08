import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { flatRoutes } from 'remix-flat-routes';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ['**/.*'],
      serverModuleFormat: 'esm',
      routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes);
      },
    }),
    tsconfigPaths(),
  ],
  assetsInclude: ['**/*.json'],
  json: {
    stringify: true,
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    exclude: ['i18next-fs-backend'],
  },
});
