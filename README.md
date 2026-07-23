# Philbrick — repository

The website for **Philbrick Technologies (India) Pvt. Ltd.**, an Ahmedabad-based
elevator-component manufacturer, exporter and supplier (founded 1992).

| Folder | What it is |
|---|---|
| [`frontend/`](frontend/) | **The website.** Next.js (App Router), static export. This is the only thing that gets deployed. Start with [`frontend/README.md`](frontend/README.md) and [`frontend/CLAUDE.md`](frontend/CLAUDE.md). |
| `wordpress/` | The client's existing WordPress site, kept as a **content reference only**. Never deployed, never edited. It is the source for the content audit: the database dump under `wordpress/wp-content/updraft/` is parsed by `frontend/scripts/parseWordpressDump.mjs` into `frontend/data/generated/`. |
| `backend/` | Empty. The site needs no backend — the contact form posts to FormSubmit.co and live chat is Tawk.to, both third-party. |
| `render.yaml` | Render Blueprint for the staging deploy: builds `frontend/`, publishes `frontend/out/`, and sets the long-lived cache headers that Render's defaults do not. |

## Quick start

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000 — every page open in development
```

`npm run build` produces the static export in `frontend/out/`; `npm run start`
serves that build so you can preview the **production** experience, where only
released routes show real content (see the page-release system in
[`frontend/SITE-STRUCTURE.md`](frontend/SITE-STRUCTURE.md)).

## Content parity

The new site must remain a **superset** of the client's WordPress site: nothing
published there may be missing here. The page-by-page comparison, ready for
client review, is
[`frontend/content-audit/Philbrick-content-audit.xlsx`](frontend/content-audit/).
