import React from 'react';
import { Check, ExternalLink, Plus } from 'lucide-react';

const CATEGORY_OPTIONS = [
  ['human', 'Human study'],
  ['review', 'Review / synthesis'],
  ['animal', 'Animal / mechanistic'],
  ['recent', 'Recent research']
];

export default function StudyCard({ study, selected, onUpdate, onToggle }) {
  return (
    <article className={`study-card ${selected ? 'selected' : ''}`}>
      <div className="study-meta">
        <span>{study.type}</span>
        <a href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`} target="_blank" rel="noreferrer">PMID {study.pmid}<ExternalLink size={12} /></a>
      </div>
      <h3>{study.title}</h3>
      <p>{study.summary}</p>
      <div className="study-tags"><span>{study.population}</span><span>{study.year}</span><span>{study.openAccess ? 'Open access' : 'Abstract'}</span></div>
      <div className="classification-row">
        <label>Evidence type
          <select value={study.category} onChange={(event) => onUpdate({ category: event.target.value })}>
            {CATEGORY_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>Relationship
          <select value={study.relevance} onChange={(event) => onUpdate({ relevance: event.target.value })}>
            <option value="supports">Supports</option>
            <option value="challenges">Challenges</option>
            <option value="complicates">Complicates</option>
            <option value="context">Adds context</option>
          </select>
        </label>
      </div>
      <button className={selected ? 'selected-button' : ''} onClick={onToggle}>{selected ? <><Check /> Added to wheel</> : <><Plus /> Add to claim wheel</>}</button>
    </article>
  );
}
