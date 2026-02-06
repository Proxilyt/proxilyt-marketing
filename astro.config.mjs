// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://subclassy.github.io",
  base: "/proxilyt-marketing/",
  output: 'static',
  integrations: [sitemap()],

  vite: {
    plugins: [tailwind()],
  },
});