import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-vercel'
import { readFileSync } from 'node:fs'

const { version: name } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))
const dev = process.env.NODE_ENV === 'development'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      images: {
        minimumCacheTTL: 300,
        formats: ['image/avif', 'image/webp'],
        sizes: process.env.PUBLIC_IMAGE_OPTIMIZATION_SIZES?.split(', ').map((x) => +x) || [],
        domains: []
      }
    }),
    version: { name }
  },
  preprocess: [vitePreprocess({})]
}

export default config
