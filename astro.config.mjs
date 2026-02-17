// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://proxilyt.github.io",
  base: "/proxilyt-marketing/",
  output: 'static',
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