import { dev } from '$app/environment'

/** @type {IntersectionObserver} */
let observer

/** @param {Element} node */
function observe(node) {
  observer =
    observer ||
    new IntersectionObserver((entries) => {
      for (const detail of entries) {
        const { isIntersecting, target } = detail
        target.dispatchEvent(new CustomEvent(isIntersecting ? 'enter' : 'leave', { detail }))
      }
    })
  observer.observe(node)
  return {
    destroy() {
      observer.unobserve(node)
    }
  }
}

function len(obj) {
  return obj && Object.keys(obj).length
}

function lqipToBackground(lqip) {
  return lqip[0] === '#' ? lqip : `url(data:image/webp;base64,${lqip}) no-repeat center/cover`
}

function srcsetVercel(src = '', widths = [], quality = 100) {
  if (typeof widths === 'string') {
    widths = widths.split(', ').map((x) => +x)
  }

  return widths
    .slice()
    .sort((a, b) => a - b)
    .map((width) => {
      let url = `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
      if (dev) url = `${src}`
      return `${url} ${width}w`
    })
    .join(', ')
}

export { observe, len, lqipToBackground, srcsetVercel }
