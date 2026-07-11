# prettyprettyprettygood

Volunteer web design for nonprofits and mission-driven organizations. Built with care, free of charge.

## Stack

- [Astro](https://astro.build) — static site framework
- TypeScript (strict mode)
- Vanilla CSS with custom properties
- [Formspree](https://formspree.io) — contact form handling and delivery
- [Vercel](https://vercel.com) — deployment

## Development

```sh
npm install
vercel link
npm run dev      # localhost:4321
npm run build
npm run preview
```

If you need Vercel env vars locally, pull them on demand:

```sh
vercel env pull .env.development.local
```

## Contact Form

The contact form (`src/components/ContactSection.astro`) submits directly to Formspree — no backend route in this repo. Spam protection is handled by:

- Cloudflare Turnstile widget, rendered client-side when `PUBLIC_TURNSTILE_SITE_KEY` is set; verified server-side by Formspree using the secret key configured in the Formspree dashboard (not stored in this repo)
- Formspree's built-in honeypot field (`_gotcha`)
