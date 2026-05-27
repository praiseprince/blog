import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://praiseprince.work',
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
