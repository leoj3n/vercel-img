<script>
/* eslint-disable no-useless-escape */
import hero from './assets/hero.jpg?w=480;1024;1920;2560;h=720&tint=ffaa22&as=run'
import i1 from './assets/1920/1.jpg?h=720&as=run'
import i2 from './assets/1920/2.jpg?h=720&as=run:1'
import i3 from './assets/1920/3.jpg?h=720&as=run'
import i4 from './assets/1920/4.jpg?h=720&as=run'
import i5 from './assets/1920/5.jpg?h=720&as=run'
import pllx from './assets/pllx.jpg?h=1024&as=run'
import Img, { FxReveal, FxParallax } from '$lib'
import { version } from '$app/environment'
import testSingle from './assets/640/01.jpg?w=80&h=80&format=jpg&as=run:0'
import testFallback from './assets/640/01.jpg?h=80'
import testProfile from './assets/640/01.jpg?as=run2'
import allowedSizes from '$lib/allowed-vercel-image-sizes'

const modules = import.meta.glob('./assets/640/*.jpg', {
  import: 'default',
  eager: true,
  query: { w: 640, h: 640, fit: 'cover', as: 'run' }
})
const esc = (i) => i
const images = Object.entries(modules).map((i) => i[1])
let selected = 0
</script>

<div class="test-basic relative mb-16">
  <Img class="h-[32rem] w-full object-cover" src={hero} alt="cat" loading="eager" />
  <div class="absolute inset-0 flex flex-col justify-center">
    <div class="prose mx-auto px-4 text-center prose-h1:text-white prose-p:text-white">
      <h1>vercel-img</h1>
      <div class="badge badge-neutral ml-2 font-mono text-xs">v{version}</div>
      <p>Fork of svelte-img for use in conjunction with Vercel optimized images.</p>
      <a class="btn btn-primary" href="https://github.com/leoj3n/vercel-img" target="_blank">
        <span class="icon-[mdi--github] h-6 w-6" />
        Visit Github Repo
      </a>
    </div>
  </div>
</div>

<div class="prose mx-auto mb-8 px-4">
  <blockquote>
    Render the bare minimum, minimally invasive, LQIP-included HTML code to represent responsive
    images, served in multiple widths and next-gen formats.
  </blockquote>
  <blockquote>
    Also allow opting into using Vercel image optimization for the transformed image, instead of
    generating all permutations locally.
  </blockquote>
  <h2>Install</h2>
  <pre><code>{esc(`$ npm i -D @leoj3n/vercel-img`)}</code></pre>
  <p>Add <code>imagetools</code> plugin into your <code>vite.config.js</code>:</p>
  <pre><code
      >{esc(`
import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { imagetools } from '@leoj3n/vercel-img/vite'

export default defineConfig({
  plugins: [sveltekit(), imagetools()]
})`)}</code
    ></pre>
  <h2>Use</h2>
  <p>Anywhere in your <code>svelte</code> app:</p>
  <pre><code
      >{esc(`
<script>
  import cat from '$lib/assets/cat.jpg?as=run'
  import Img from '@leoj3n/vercel-img'
</script>

<Img class="cool kitty" src={cat} alt="Very meow" />`)}</code
    ></pre>
  <h2 id="vercel">Vercel</h2>
  <p>
    If <code>widths</code> is passed a prop to <code>Img</code> then a single <code>img</code>
    element will be generated, and it will have an <code>srcset</code> with matching
    <code>widths</code>
    linking to Vercel like <code>/_vercel/image?url=...&w=480&q=100 480w</code> (note that in dev
    mode the link will be to the local image for all widths as they may not exist on Vercel until
    deployed). You can additionally pass <code>quality</code> for Vercel to consume. Any image type
    variants will be ignored, and if there are size variants, the largest will be used. See
    <a href="https://vercel.com/docs/image-optimization#optimized-url-format"
      >Image Optimization with Vercel</a
    > for more info about the URL syntax.
  </p>
</div>

<Img
  class="mx-auto mb-16 h-[32rem] w-full max-w-[1920px] object-cover"
  src={hero}
  alt="cat"
  preload={true}
  widths={allowedSizes}
/>

<div class="prose mx-auto mb-8 px-4">
  <pre><code>{esc(`<Img src={hero} alt="cat" widths={PUBLIC_IMAGE_OPTIMIZATION_SIZES} />`)}</code
    ></pre>
  <p>
    For Vercel image optimization to work, the <code>widths</code> passed in to <code>Img</code>
    must match what you have put in your
    <code>vercel.json</code> for <code>sizes</code>:
  </p>
  <pre><code
      >{esc(`
{
  "sizes": [480, 1024, 1920, 2560],
  "routes": [
    {
      "src": "/immutable/.+",
      "headers": {
        "cache-control": "public, immutable, max-age=31536000"
      }
    }
  ]
}
    `)}</code
    ></pre>
  <p>
    Or <code>sizes</code> in <code>svelte.config.js</code> when using
    <code>@sveltejs/adapter-vercel</code>:
  </p>
  <pre><code
      >{esc(`
import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      images: {
        minimumCacheTTL: 300,
        formats: ['image/avif', 'image/webp'],
        sizes: process.env.PUBLIC_IMAGE_OPTIMIZATION_SIZES?.split(', ').map(x => +x) || [],
        domains: []
      }
    }),
    alias: {
      $static: './static'
    }
  }
};

export default config
    `)}</code
    ></pre>
  <p>
    You can read more about the <a
      href="https://vercel.com/docs/projects/project-configuration#images"
      >Vercel image value definitions</a
    >.
  </p>
  <p>
    Notice we are using an environment variable to get the allowed Vercel optimization sizes so we
    don't have to hard code the values and can update them in one place.
  </p>
  <p>
    This variable is defined in
    <code>.env</code>
    like <code>PUBLIC_IMAGE_OPTIMIZATION_SIZES="480, 1024, 1920, 2560"</code>. The
    <code>Img</code>
    component will split on any comma-space-separated string passed as <code>widths</code> in the
    same way as can be seen in the config above. You may also pass an array of numbers as
    <code>widths</code> which means instead of an environment variable you can create a file in
    <code>lib</code> such as <code>./src/lib/allowed-vercel-image-sizes.js</code> that exports like so:
  </p>
  <pre><code
      >{esc(`export default [480, 1024, 1920, 2560]
    `)}</code
    ></pre>
  <p>
    You can then import that in <code>svelte.config.js</code>:
  </p>
  <pre><code
      >{esc(`
import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import allowedSizes from './src/lib/allowed-vercel-image-sizes.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      images: {
        minimumCacheTTL: 300,
        formats: ['image/avif', 'image/webp'],
        sizes: allowedSizes,
        domains: []
      }
    }),
    alias: {
      $static: './static'
    }
  }
};

export default config
    `)}</code
    ></pre>
  <p>
    As well as whenever you need to pass <code>widths</code> to the <code>Img</code> component to trigger
    Vercel optimized images:
  </p>
  <pre><code
      >{esc(`
<script>
  import hero from './assets/hero.jpg?tint=ffaa22&as=run'
  import allowedSizes from '$lib/allowed-vercel-image-sizes.js'
</script>
<Img
  alt="cat"
  src={hero}
  preload={true}
  widths={allowedSizes}
/>
    `)}</code
    ></pre>
  <p>
    In this way we can generate a locally transformed image that will then be optimized and cached
    by Vercel on the edge. Don't forget to pass <code>sizes</code> to <code>Img</code> as well to
    help the browser know how big the image will be in your design once it loads. You might also
    want to set <code>preload={true}</code> for your most important above-the-fold image. Also
    remember to leverage <code>fetchpriority="high"</code> for other important images, and
    <code>loading="eager"</code> for images you don't want loaded lazily (such as above-the-fold).
  </p>
  <h2>Showcase</h2>
  <p>
    By default, the original image is transformed into 9 variants - <code>480/1024/1920</code>
    widths at <code>avif/webp/jpg</code> formats, with an inline <code>base64</code> low-quality image
    placeholder (LQIP) background.
  </p>
</div>

<Img class="mx-auto mb-16 h-[32rem] w-full max-w-[1920px] object-cover" src={i1} alt="cat" />

<div class="prose mx-auto mb-8 px-4">
  <p>
    The LQIP is typically a 16px <code>webp;base64</code> data URI at about ≈150 bytes.
  </p>
</div>

<img
  class="mx-auto mb-16 h-[32rem] w-full max-w-[1920px] object-cover"
  src="data:image/webp;base64,{i1.img.lqip}"
  alt="cat lqip"
/>

<div class="prose mx-auto mb-8 px-4">
  <p>
    It's <em>not</em> recommended, but you can apply a Gaussian blur <code>backdrop-filter</code>.
  </p>
</div>

<div
  class="mx-auto mb-16 h-[32rem] w-full max-w-[1920px] overflow-hidden"
  style="background: url(data:image/webp;base64,{i1.img.lqip}) no-repeat center/cover"
>
  <div class="h-full w-full backdrop-blur-[20px]" />
</div>

<div class="prose mx-auto mb-8 px-4">
  <p>Not much difference, is there? The next image has a dominant colour placeholder instead.</p>
</div>

<div class="test-run-param">
  <Img
    class="test-1px mx-auto mb-16 h-[32rem] w-full max-w-[1920px] object-cover"
    src={i2}
    alt="cat"
  />
</div>

<div class="prose mx-auto mb-8 px-4">
  <p>Which looks like this.</p>
</div>

<div class="mx-auto mb-16 h-[32rem] w-full max-w-[1920px]" style="background:{i2.img.lqip}" />

<div class="prose mx-auto mb-8 px-4">
  <p>
    You can also reveal images with <code>fade-in</code> special effects.
  </p>
</div>

<div class="mb-16">
  <FxReveal class="mx-auto h-[32rem] w-full max-w-[1920px] object-cover" src={i3} alt="cat" />
</div>

<div class="mb-16">
  <FxReveal class="mx-auto h-[32rem] w-full max-w-[1920px] object-cover" src={i4} alt="cat" />
</div>

<div class="mb-16">
  <FxReveal class="mx-auto h-[32rem] w-full max-w-[1920px] object-cover" src={i5} alt="cat" />
</div>

<div class="prose mx-auto mb-8 px-4">
  <p>Or even apply parallax scrolling special effects.</p>
</div>

<div class="mx-auto mb-16 w-full max-w-[1920px]">
  <FxParallax class="h-[40rem] w-full" src={pllx} alt="cat" />
</div>

<div class="prose mx-auto mb-16 px-4">
  <blockquote>
    The <code>vercel-img</code> component tries, as much as possible, to be a drop-in replacement
    for the native HTML <code>{esc(`<img>`)}</code> tag.
  </blockquote>
  <p>
    Side-effects are kept to a minimum, so things should still work even without JavaScript. Try it
    - disable JS on this page and refresh, and check out the Lighthouse score too.
  </p>
  <p>
    The next example however does require JavaScript, because interactivity. It uses the
    <code>Vite</code> pattern for glob imports to load a local directory of images, like so:
  </p>
  <pre><code
      >{esc(`const modules = import.meta.glob('$lib/assets/sm/*.jpg', {
  import: 'default',
  eager: true,
  query: { w: 640, h: 640, fit: 'cover', as: 'run' }
})

const images = Object.entries(modules).map((i) => i[1])
`)}</code
    ></pre>
</div>

<div class="relative mb-16 flex w-full flex-col items-center lg:flex-row lg:justify-center">
  <div class="sticky top-0 aspect-square w-full max-w-sm overflow-hidden shadow-md lg:relative">
    <FxReveal class="h-full w-full" src={images[selected]} alt="cat" />
  </div>
  <div class="mt-6 flex w-full max-w-xl flex-wrap justify-center lg:mt-0">
    {#each images as src, i}
      <div class="m-3 aspect-square w-28">
        <Img
          class="h-full w-full cursor-pointer border-4 {selected === i
            ? 'border-primary'
            : 'border-base-200'}"
          {src}
          alt="cat"
          on:click={() => (selected = i)}
        />
      </div>
    {/each}
  </div>
</div>

<!-- Start tests -->
<div class="test-single hidden">
  <Img src={testSingle} alt="test" />
</div>
<div class="test-fallback hidden">{JSON.stringify(testFallback)}</div>
<div class="test-profile hidden">
  <Img src={testProfile} alt="test" />
</div>
<!-- End tests -->

<footer
  class="flex h-96 w-full flex-row items-center justify-center bg-neutral text-neutral-content"
>
  <span class="icon-[mdi--email] mr-2 h-6 w-6" />
  <a class="link" href="mailto:jason@zerodevx.com">jason@zerodevx.com</a>
</footer>
