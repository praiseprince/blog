import { defineConfig } from 'astro/config';
import { getSiteUrl } from './src/lib/siteUrl.js';

export default defineConfig({
  site: getSiteUrl(),
  output: 'static',
  build: {
    format: 'directory',
  },
  markdown: {
    smartypants: true,
    shikiConfig: {
      theme: 'css-variables',
      wrap: false,
    },
  },
  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.io', 'localhost'],
    },
  },
});
