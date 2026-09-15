# Timestamp Tool

Pure static web app for Unix timestamp conversion and timezone-aware duration calculation. Built with Vite, React, TypeScript, Luxon, Tailwind CSS, and i18next (English / 中文).

## Features

- Convert Unix timestamps (seconds or milliseconds) to UTC and any IANA time zone
- Convert wall-clock date/time in a chosen zone to timestamps
- Compute duration from a start time to now or a custom end time
- Searchable time zone picker with UTC offset (including DST)

## Development

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host (GitHub Pages, Cloudflare Pages, Nginx, etc.). No server or environment variables required.

## Language

Use the header toggle to switch between English and 中文. Preference is stored in `localStorage` under `time-tool-lang`.
