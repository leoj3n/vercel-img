<script>
import { page } from '$app/stores'
import Picture from './Picture.svelte'
import { len, lqipToBackground, srcsetVercel } from './utils.js'

/** @type {Object} imagetools import */
export let src = {}
/** @type {string|undefined} img tag `sizes` attr */
export let sizes = undefined
/** @type {number|undefined} img width override */
export let width = undefined
/** @type {number|undefined} img height override */
export let height = undefined
/** @type {number|undefined} img tag `quality` attr */
export let quality = undefined
/** @type {string|array|undefined} img tag `widths` attr */
export let widths = undefined
/** @type {false|true} img tag `preload` attr */
export let preload = false
/** @type {'lazy'|'eager'} img tag `loading` attr */
export let loading = 'lazy'
/** @type {'auto'|'high'|'low'} img tag `fetchpriority` attr */
export let fetchpriority = 'auto'
/** @type {'async'|'auto'|'sync'} img tag `decoding` attr */
export let decoding = 'async'
/** @type {HTMLImageElement|undefined} bindable reference to `<img>` element */
export let ref = undefined

let sources = []
let img = {}
let background = undefined
let srcset = ''

$: sources = src.sources || {}
$: img = src.img || {}
$: if (len(img)) {
  const { lqip } = img
  background = lqip ? lqipToBackground(lqip) : undefined
}
$: if (widths) {
  let imgs = Object.values(sources)[0]
    .split(', ')
    .map((set) => {
      let pair = set.split(' ')
      return {
        src: pair[0].replace($page.url.origin, ''),
        w: pair[1].replace('w', '')
      }
    })
  let largest = imgs.sort((a, b) => b.w - a.w)[0]
  srcset = srcsetVercel(largest.src, widths, quality)
}
</script>

<svelte:head>
  {#if preload}
    <link as="image" rel="preload" fetchpriority="high" imagesizes={sizes} imagesrcset={srcset} />
  {/if}
</svelte:head>

{#if len(img)}
  {#if widths}
    <!-- svelte-ignore a11y-missing-attribute a11y-no-noninteractive-element-interactions -->
    <img
      {loading}
      {decoding}
      {fetchpriority}
      width={width || img.w || undefined}
      height={height || img.h || undefined}
      style:background
      bind:this={ref}
      on:click
      on:load
      {...$$restProps}
      {sizes}
      {srcset}
      src={img.src}
    />
  {:else}
    <Picture {sources} {sizes}>
      <!-- svelte-ignore a11y-missing-attribute a11y-no-noninteractive-element-interactions -->
      <img
        {loading}
        {decoding}
        {fetchpriority}
        width={width || img.w || undefined}
        height={height || img.h || undefined}
        style:background
        bind:this={ref}
        on:click
        on:load
        {...$$restProps}
        src={img.src}
      />
    </Picture>
  {/if}
{/if}
