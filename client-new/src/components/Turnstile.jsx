/*
  Turnstile — Cloudflare's bot check for the public forms (contact + seminar sign-up).

  Loads Cloudflare's script once, renders the widget, and reports each single-use
  token through onToken (null when it expires or errors). onToken should be stable,
  e.g. a useState setter. A token can be verified only once, so the parent calls
  ref.current.reset() after a failed submit to get a fresh one.

  The widget stays hidden unless Cloudflare needs the visitor to click a checkbox
  ("interaction-only"). Outside production it uses Cloudflare's always-pass test site
  key, which pairs with the test secret the server falls back to in development.
*/
import { useEffect, useImperativeHandle, useRef } from 'react'

const SITE_KEY = import.meta.env.PROD ? '0x4AAAAAAFWH_4IrDgQWnrXh' : '1x00000000000000000000AA'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
// The full-size widget needs 300px; narrower forms (small phones) get the compact one.
const FULL_WIDGET_MIN_WIDTH = 300

let scriptPromise
function loadTurnstile() {
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.onload = () => resolve(window.turnstile)
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

export default function Turnstile({ onToken, ref }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)

  useImperativeHandle(ref, () => ({
    reset() {
      onToken(null)
      if (widgetIdRef.current != null) window.turnstile?.reset(widgetIdRef.current)
    },
  }), [onToken])

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: 'light',
          appearance: 'interaction-only',
          size: containerRef.current.offsetWidth < FULL_WIDGET_MIN_WIDTH ? 'compact' : 'flexible',
          callback: (token) => onToken(token),
          'expired-callback': () => onToken(null),
          'error-callback': () => onToken(null),
        })
      })
      .catch(() => onToken(null))
    return () => {
      cancelled = true
      if (widgetIdRef.current != null) {
        window.turnstile?.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [onToken])

  return <div ref={containerRef} />
}
