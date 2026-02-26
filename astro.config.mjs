// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://proxilyt.com",
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile'
  }),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    })
  ],

  vite: {
    plugins: [tailwind()],
  },
});