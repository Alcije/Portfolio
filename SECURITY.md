# Security notes

This portfolio is a static website that does not collect user input, store cookies, or load third-party assets.

## Current safeguards

- **Zero external runtime dependencies**: No external JavaScript, CSS, web fonts, icons, trackers, or images. All assets are local and served from `'self'`.
- **Zero inline scripts or inline styles**: No `<script>`, `<style>`, `style="..."`, `on*` handlers, or `data:` URIs in HTML.
- **Strict deny-by-default Content Security Policy**:
  - Delivered via `<meta http-equiv="Content-Security-Policy">` on every HTML page (ensuring protection even on hosts that ignore `_headers`, such as GitHub Pages).
  - Reinforced in `_headers` for compatible hosts (Netlify, Cloudflare Pages) with `frame-ancestors 'none'`, `sandbox allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox`, and `upgrade-insecure-requests`.
- **Clickjacking & framing defense**: `X-Frame-Options: DENY` and `frame-ancestors 'none'` in `_headers`, plus an HTTPS frame-busting fallback in `script.js` for hosts without custom header support.
- **Transport, isolation & privacy headers (`_headers`)**:
  - `Strict-Transport-Security` (2-year HSTS with `includeSubDomains; preload`)
  - `Referrer-Policy: no-referrer` (also set via `<meta name="referrer">`)
  - `X-Content-Type-Options: nosniff`
  - `X-Permitted-Cross-Domain-Policies: none`
  - `X-DNS-Prefetch-Control: off`
  - `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`, `Cross-Origin-Resource-Policy: same-origin`, and `Origin-Agent-Cluster: ?1`
  - `Cache-Control: no-transform` to prevent proxy modification in transit
  - Restrictive `Permissions-Policy` disabling camera, microphone, geolocation, USB, serial, HID, payment, sensors, topics, and WebAuthn/storage APIs.
- **Safe link & DOM handling (`script.js`)**:
  - Runs in `'use strict'` inside an IIFE with zero leaked globals.
  - External links use `rel="noopener noreferrer external"` and are validated at runtime against an explicit origin/path allowlist.
  - Navigation active state uses an explicit page allowlist; DOM updates use `textContent` and `classList` only (never `innerHTML`).
- **No public email address or contact form**.
- **RFC 9116 security contact**: Provided at `/.well-known/security.txt`.

## Before adding a contact form

Use server-side validation, strict length limits, rate limiting, CSRF protection, anti-spam protection, and a privacy-conscious form processor. Never place private API keys in client-side code.

## Reporting a problem

Open an issue through the public GitHub profile linked from the website (`https://github.com/Alcije`), or see `/.well-known/security.txt`.
