import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-vercel'
import { readFileSync } from 'node:fs'
import allowedSizes from './src/lib/allowed-vercel-image-sizes.js'

const { version: name } = JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8'))

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      images: {
        minimumCacheTTL: 300,
        formats: ['image/avif', 'image/webp'],
        sizes: allowedSizes,
        domains: []
      }
    }),
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // ignore vercel optimized images
        if (path.startsWith('/_vercel/image')) {
          console.info(
            'Info: Handled the expected "Not Found" 404 for /_vercel/image CDN ...',
            referrer
          )
          return
        }

        // otherwise fail the build
        throw new Error(message)
      }
    },
    version: { name }
  },
  preprocess: [vitePreprocess({})]
}

export default config
