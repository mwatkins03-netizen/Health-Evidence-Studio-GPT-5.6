/**
 * Example Vercel-style serverless endpoint.
 * Route: /api/pubmed?q=aspartame+cancer+humans
 *
 * Add NCBI_API_KEY and NCBI_EMAIL in your hosting environment.
 */
export default async function handler(req, res) {
  const q = String(req.query?.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  const key = process.env.NCBI_API_KEY ? `&api_key=${encodeURIComponent(process.env.NCBI_API_KEY)}` : '';
  const email = process.env.NCBI_EMAIL ? `&email=${encodeURIComponent(process.env.NCBI_EMAIL)}` : '';
  const tool = '&tool=evidence_studio';

  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=12&term=${encodeURIComponent(q)}${key}${email}${tool}`;
    const search = await fetch(searchUrl).then(r => r.json());
    const ids = search?.esearchresult?.idlist || [];
    if (!ids.length) return res.status(200).json({ items: [] });

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}${key}${email}${tool}`;
    const summary = await fetch(summaryUrl).then(r => r.json());

    const items = ids.map(id => {
      const r = summary.result?.[id] || {};
      const pubtypes = r.pubtype || [];
      const title = r.title || 'Untitled PubMed record';
      let category = 'human';
      const types = pubtypes.join(' ').toLowerCase();
      if (types.includes('review') || types.includes('meta-analysis')) category = 'review';
      if (/animal|mouse|mice|rat|in vitro/i.test(title)) category = 'animal';
      const year = Number(String(r.pubdate || '').slice(0,4)) || undefined;
      if (year && year >= new Date().getFullYear() - 2) category = 'recent';
      return {
        pmid: id,
        title,
        summary: 'Open this record in PubMed for the abstract. The production build can extend this endpoint with EFetch for abstracts and ELink for PMC availability.',
        type: pubtypes[0] || 'PubMed record',
        population: 'Student classification needed',
        year: year || '—',
        category,
        relevance: 'complicates',
        openAccess: false
      };
    });
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ error: 'NCBI request failed', detail: String(error) });
  }
}
