import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function apiMiddleware(mode) {
  return {
    name: 'api-middleware',
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), '');
      Object.assign(process.env, env);

      server.middlewares.use('/api/create-order', async (req, res) => {
        const handler = (await import('./api/create-order.js')).default;
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        await handler(req, res);
      });

      server.middlewares.use('/api/verify-payment', async (req, res) => {
        const handler = (await import('./api/verify-payment.js')).default;
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        await handler(req, res);
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), apiMiddleware(mode)],
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/]react/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
}))
