# Yingbo Fan — Academic Homepage

A custom, zero-dependency static academic website designed for GitHub Pages.

Live site: <https://yingbofan.github.io>

## Structure

- `content/site.json` — English profile information, metrics, research highlights, publications, projects, patents, education, and awards.
- `content/site.zh.json` — the corresponding Chinese content used by the `/zh/` pages.
- `public/assets/` — portrait, original-paper teasers, social preview, downloadable CV, and static images.
- `src/styles.css` — the visual system and responsive layout.
- `src/site.js` — mobile navigation and publication filtering.
- `scripts/build.mjs` — generates the complete static site.
- `scripts/build_cv.py` — regenerates the downloadable English Academic CV from `content/site.json`.
- `dist/` — generated output; do not edit by hand.

## Local preview

```bash
npm run build
npm run serve
```

Open `http://localhost:4173`.

## Routine updates

1. Edit `content/site.json` and mirror text changes in `content/site.zh.json`.
2. Add or replace images in `public/assets/`.
3. If CV content changed, run `npm run build:cv`.
4. Run `npm run build` and `npm run validate`.
5. Commit and push to `main`.

GitHub Actions builds and deploys the site automatically.

## Items intentionally left provisional

- Replace the Google Scholar and Semantic Scholar search links with verified author-profile URLs when available.
- Add public paper, code, project, and demo links for ongoing research after release.
- Review the English wording of current affiliation and postdoctoral role before final public deployment.
- Keep review-only manuscripts and restricted anonymous-submission files out of `public/`.
