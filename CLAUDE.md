# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public website for Saint Rose Philippine Duchesne Catholic Parish (Anthem, Arizona), served via GitHub Pages at `saintroseanthem.org` (see `CNAME`). It is pure static HTML/CSS/JS — no build step, no package manager, no framework. Each page is a single self-contained `.html` file with its CSS in a `<style>` block and its JS in a `<script>` block at the bottom; there are no shared `.css`/`.js` files to edit.

## Development

There is no build/lint/test tooling. To preview changes, open the HTML files directly in a browser or serve the directory statically, e.g.:

```
python3 -m http.server 8000
```

**Pushing to `main` deploys live** to saintroseanthem.org via GitHub Pages — there is no build/release/staging step in between. Commits go directly to `main`; this repo doesn't use feature branches or merge commits. Treat every push as production.

## Pages

- `index.html` — homepage (hero, mass schedule, events, gallery, "Around the Parish", Parish Development, welcome section)
- `bulletin.html` — weekly bulletin (reflection, mass intentions, events, announcements)
- `calendar.html` — parish events calendar
- `advertise.html` — public form for local businesses to apply as bulletin/website advertising partners (uploads images, submits a `partnerRequests` doc)
- `advertisers.html` — displays approved advertising partners
- `parish-registration.html` — new family registration form (includes ZIP → city/state autofill)
- `privacy.html`, `terms.html` — static legal pages

## Architecture: Firestore as a headless CMS

Content that changes often (mass schedule, events, announcements, weekly reflection, mass intentions, homepage gallery/hero/welcome copy, Parish Development section, advertising partners, family registrations) is **not hardcoded** — each page fetches it client-side from Google Cloud Firestore's REST API and renders it into the DOM on load:

```
https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/...
```

- `PROJECT_ID` is `saint-rose-anthem`; the `API_KEY` is a public Firebase Web API key hardcoded at the top of each page's `<script>` block (this is normal for Firebase — access is meant to be constrained by Firestore security rules, not key secrecy).
- Reads are unauthenticated `GET`s against paths like `parishes/saint-rose-anthem/events`, `.../massIntentions`, `.../announcements`, `.../weeklyReflection`, and singleton docs under `.../siteContent/{massSchedule,hero,gallery,homeWelcome,aroundParish,parishDevelopment}`.
- Writes happen only from the public-facing forms (`advertise.html` → `partnerRequests`, `parish-registration.html` → `familyRegistrations`), posted as Firestore's JSON document format (`{fields: {key: {stringValue: ...}}}`).
- Image uploads (`advertise.html`) go straight to Firebase Storage via its REST upload endpoint (`firebasestorage.googleapis.com/v0/b/{BUCKET}/o/...`), sending base64-decoded bytes from a `FileReader`, before the resulting URL is included in the Firestore write.
- Every fetch has a fallback: if the request fails, each page falls back to a hardcoded `*_DEFAULTS` object (e.g. `MASS_SCHEDULE_DEFAULTS` in `index.html`) so the page still renders sensible content offline or if Firestore is unreachable.
- There is a separate admin "portal" (not in this repo, at `https://portal.saintroseanthem.org`, a GitHub Pages site backed by the `strose-admin` repo) that actually edits this Firestore data. In `index.html`'s nav, the top-level `Admin ▾` trigger itself is inert by design (`href="#"`, `onclick="return false;"` — it's just the hover label for the dropdown); the real links are its dropdown items (desktop) and matching mobile-menu items, which open the portal's Parish Staff view (`.../portal.saintroseanthem.org`) and Finance Council view (`.../portal.saintroseanthem.org/finance.html`) in a new tab.

**CRITICAL — Firestore paths must be nested under `parishes/saint-rose-anthem/{collection}`, never a root-level collection.** `advertise.html` and `parish-registration.html` build this correctly today by defining `BASE` as `.../documents/parishes/saint-rose-anthem` and appending the collection name to it. A prior bug posted form submissions to a root-level path instead (`.../documents/partnerRequests`); Firestore rules don't allow root-level writes, so submissions silently failed for weeks with no client-side error. When adding or reviewing any Firestore write (or read), explicitly verify the full URL resolves to the nested `parishes/saint-rose-anthem/...` path before considering the change done — don't just trust that `BASE` is defined correctly elsewhere in the file.

Public forms writing to Firestore without login is intentional but not the default: `parish-registration.html` and `advertise.html` can do unauthenticated creates only because Firestore's security rules explicitly grant an `isPublicSubmission`-style allow-create rule scoped to that exact collection (`familyRegistrations`, `partnerRequests`). Those rules live outside this repo. Never assume a new collection is publicly writable — a new public-facing form needs a matching rule added on the Firestore side before it will work, following the same scoped pattern.

When editing content that appears dynamic (schedules, events, announcements, gallery images, partner listings), check whether it's sourced from Firestore before hardcoding a change in the HTML — a hardcoded edit will only serve as the fallback, not the live content.

## Shared conventions across pages

Since there's no shared stylesheet, conventions are duplicated per file — keep them in sync manually when changing site-wide look and feel:

- Design system is "Sonoran Dusk", shared with the sibling app and admin-portal repos (BURGUNDY `#5C1A2E`, DUSTY_ROSE `#C17A8A`, GOLD `#C9A84C`, LINEN `#E8DDD0`, SAND `#F7F3EE`, SOIL `#3D2B2B`). In this repo the tokens are CSS custom properties redeclared per page in `:root`, kebab-case and lowercase (`--burgundy`, `--dusty-rose`, `--gold`, `--linen`, `--sand`, `--soil`), plus a few local-only extras not present in the sibling repos (`--burgundy-dark`, `--burgundy-light`, `--gold-light`, `--white`). Reuse these variables rather than introducing new hex values, and keep the base six colors' hex values identical to the sibling repos if they ever change.
- Fonts are Google Fonts `Cinzel` (headings/labels, serif small-caps feel via letter-spacing) and `Faustina` (body), loaded via the same `<link>` in each `<head>`.
- Nav bar, mobile hamburger menu (`toggleMenu()`), and scroll-reveal (`IntersectionObserver` on `.reveal` elements) are copy-pasted per page rather than shared.
- Images referenced by pages live in `images/`; `Dedication/` holds a specific photo set used on the homepage. `images/originals_backup`, `Ad Images/`, and `images extras/` are not referenced by any page — treat them as raw/backup assets, not active site content.
