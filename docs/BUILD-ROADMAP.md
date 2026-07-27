# Build Roadmap

## Phase 1 — Functional classroom prototype
- Claim editor
- PubMed search through NCBI ESearch + ESummary
- Study cards
- Student relevance classification
- Claim Wheel
- Evidence tension prompt
- Local browser persistence
- HTML/print export

## Phase 2 — Research depth
- EFetch abstracts
- ELink PubMed → PMC
- MeSH term display
- Publication type filters
- Open-access filter
- Study comparison view
- Better classification using publication metadata without substituting AI judgment for student judgment

## Phase 3 — Faculty tools
- Prepared claim packs
- Assignment presets
- Required source/evidence mix
- Instructor rubric
- Exported student evidence dossier
- Optional LMS handoff

## Phase 4 — Extended NCBI ecosystem
- PMC full-text links
- PubChem compound lens
- Gene / Protein relationship panels
- Optional advanced biomedical mechanism activities

## Claim Wheel mechanics
Recommended state per sector: 0–3.

0 — no evidence inspected
1 — some evidence inspected
2 — multiple relevant sources / meaningful comparison
3 — sufficiently developed to support a student explanation

The number is a **coverage indicator**, never a confidence percentage.

### Suggested interaction
- Drag or click `Add to Claim Wheel` on a study.
- Sector fills one radial depth level.
- Selecting contradictory studies introduces a visible tension marker.
- Missing source types create an obvious gap.
- The center claim stays editable throughout.

## Keramos relationship
Do not copy Keramos source code without an applicable license/permission. Treat the project as interaction inspiration only: rotational manipulation, radial shaping, tactile feedback, and the metaphor of repeatedly reshaping a form.

## Deployment
Recommended:
- Vite/React front end
- Vercel or Netlify
- Serverless `/api/pubmed` proxy
- NCBI API key stored only in environment variables
- Query caching to reduce duplicated classroom traffic
