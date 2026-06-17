import { useEffect } from 'react'

export default function useMetaTags({ title, description, url }) {
  useEffect(() => {
    const base = 'Contractor Garage™'
    const fullTitle = title ? `${title} | ${base}` : base

    document.title = fullTitle

    setMeta('description', description)
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'website', 'property')
    if (url) setMeta('og:url', url, 'property')

    return () => {
      document.title = base
    }
  }, [title, description, url])
}

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
