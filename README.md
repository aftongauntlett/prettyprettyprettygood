# prettyprettyprettygood

Volunteer web design for nonprofits and mission-driven organizations. Built with care, free of charge.

## Stack

- [Astro](https://astro.build) — static site framework
- TypeScript (strict mode)
- Vanilla CSS with custom properties
- [Resend](https://resend.com) — contact email delivery
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

## Contact Endpoint Security

- Same-origin `Origin`/`Referer` enforcement
- Honeypot field (`project-url`) and submit-timing trap (`form-started-at`)
- Server-side validation and HTML escaping before rendering email content
- Distributed Upstash Redis rate limiting (IP and email-based, configurable with env vars)
- Optional Cloudflare Turnstile verification when `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set

## Redis Keepalive Cron

- Cron path: `/api/redis-keepalive`
- Schedule: daily at `03:17` UTC (configured in `vercel.json`)
- Required env var in Vercel: `CRON_SECRET` (used to authenticate cron requests)
