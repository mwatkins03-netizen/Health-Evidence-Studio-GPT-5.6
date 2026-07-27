# Evidence Studio — Health Claim Investigator

A production-ready React/Vite learning tool for investigating health claims through biomedical evidence.

## What is included

- A guided six-step investigation flow
- Editable claim and research question
- PubMed search with a curated offline practice set
- Evidence-type and relationship classification
- Investigator notes for selected studies
- An accessible visual and semantic Claim Wheel
- Side-by-side evidence tension mapping
- A synthesis and next-question workspace
- A print/PDF-ready investigation dossier
- Automatic device-local saving
- Responsive navigation and keyboard-friendly controls
- A custom social preview image
- Example serverless NCBI proxy and integration notes

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. Work is saved automatically in the browser on that device.

## Production build

```bash
npm run build
```

The deployable static output is written to `dist/`. The app ships with sample evidence, so the complete investigation workflow works even when the serverless API is not configured.

## Publish with GitHub Pages

This repository includes an automatic GitHub Pages deployment workflow.

1. Create a new empty GitHub repository.
2. Upload or push all files from this folder to the repository's `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish.

The site will be available at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

The Vite build uses relative asset paths, so it works from a repository subpath without editing the project name into the source.

## Live PubMed setup

GitHub Pages is static hosting, so it cannot execute the included serverless function. Without an API URL, the app automatically uses its curated practice evidence.

The included `api/pubmed.js` is written in a Vercel-style handler format. To connect live search:

1. Deploy with a host that supports `/api` serverless functions, or adapt the handler to Netlify/Express.
2. Copy `.env.example` to `.env.local`.
3. Add `NCBI_EMAIL`.
4. Add an `NCBI_API_KEY` for higher permitted request volume.
5. Set `VITE_PUBMED_API_URL` to the public proxy URL (or `/api/pubmed` on a same-origin Vercel deployment).
6. Extend the proxy with EFetch and ELink for abstracts and PMC availability.

## Core pedagogical rule
**The app never answers the health claim for the student.**

It helps the student:
1. refine the claim,
2. find evidence,
3. classify evidence,
4. compare contradictions,
5. identify gaps,
6. revise what they are willing to claim.

## Assets
- `public/assets/site-render.png` — approved concept direction
- `public/assets/claim-wheel-empty.svg` — standalone claim wheel
- `public/assets/botanical-sprig.svg` — decorative botanical asset
- `public/assets/evidence-chip-human.svg`
- `public/assets/evidence-chip-review.svg`
- `public/assets/evidence-chip-animal.svg`

## Key files

- `src/App.jsx` — investigation flow and application state
- `src/components/ClaimWheel.jsx` — visual evidence map
- `src/components/StudyCard.jsx` — evidence classification cards
- `src/styles.css` — responsive visual system and print styles
- `src/data/sampleStudies.js` — offline fallback data
- `api/pubmed.js` — NCBI proxy starter
- `docs/DESIGN-BRIEF.md`
- `docs/BUILD-ROADMAP.md`
- `docs/API-INTEGRATION.md`

## Recommended next integrations

1. Extend the proxy with EFetch for abstracts and ELink for PMC availability.
2. Add accounts and cloud persistence for cross-device work.
3. Add faculty-created claim packs and assignment sharing.
4. Add citation-format selection to the dossier export.
