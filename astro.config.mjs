// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.proxilyt.com',
  base: '/',
  output: 'static',
  integrations: [sitemap()],

  vite: {
    plugins: [tailwind()],
  },
});