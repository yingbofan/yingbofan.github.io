# Yingbo Fan — Academic Homepage

A custom, zero-dependency static academic website designed for GitHub Pages.

## Structure

- `content/site.json` — the single source of truth for profile information, metrics, research highlights, publications, projects, patents, education, and awards.
- `public/assets/` — portrait, research teasers, and static images.
- `src/styles.css` — the visual system and responsive layout.
- `src/site.js` — mobile navigation and publication filtering.
- `scripts/build.mjs` — generates the complete static site.
- `dist/` — generated output; do not edit by hand.

## Local preview

```bash
npm run build
npm run serve
```

Open `http://localhost:4173`.

## Routine updates

1. Edit `content/site.json`.
2. Add or replace images in `public/assets/`.
3. Run `npm run build`.
4. Commit and push to `main`.

GitHub Actions builds and deploys the site automatically.

## Items intentionally left provisional

- Replace `public/assets/profile-placeholder.svg` with a real portrait while keeping the same filename, or update the path in `scripts/build.mjs`.
- Replace the concept teaser SVGs with paper figures when those materials are public.
- Replace the Google Scholar and Semantic Scholar search links with verified author-profile URLs when available.
- Add public paper, code, project, and demo links for ongoing research after release.
- Review the English wording of current affiliation and postdoctoral role before final public deployment.
