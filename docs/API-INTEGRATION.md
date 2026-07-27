# NCBI / PubMed Integration

## Initial endpoints

### ESearch
Search PubMed and return PMIDs.

`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`

Parameters:
- `db=pubmed`
- `retmode=json`
- `term=...`
- `retmax=...`
- `tool=evidence_studio`
- `email=...`
- `api_key=...` when available

### ESummary
Retrieve lightweight metadata for a PMID list.

`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`

### EFetch
Production extension for PubMed XML / abstracts.

`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`

### ELink
Use to discover related PMC records and other NCBI relationships.

`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi`

## Recommended server-side data normalization
```ts
interface EvidenceStudy {
  pmid: string;
  pmcid?: string;
  doi?: string;
  title: string;
  abstract?: string;
  journal?: string;
  year?: number;
  publicationTypes: string[];
  meshTerms: string[];
  evidenceFamily: 'human' | 'animal' | 'mechanistic' | 'review' | 'unknown';
  openAccess?: boolean;
  studentJudgment?: 'supports' | 'challenges' | 'complicates' | 'context' | 'irrelevant';
  relevanceNote?: string;
  limitationNote?: string;
}
```

## Important pedagogical boundary
Do not infer “this proves the claim” from publication type, title, abstract, citation count, or date. Metadata can organize the evidence; students must interpret what it means.
