import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Download,
  ExternalLink,
  FlaskConical,
  Leaf,
  Menu,
  Printer,
  Scale,
  Search,
  Sparkles,
  X
} from 'lucide-react';
import ClaimWheel, { CATEGORIES } from './components/ClaimWheel.jsx';
import StudyCard from './components/StudyCard.jsx';
import { SAMPLE_STUDIES } from './data/sampleStudies.js';

const STORAGE_KEY = 'evidence-studio-investigation-v2';
const DEFAULT_STATE = {
  claim: 'Artificial sweeteners cause cancer.',
  researchQuestion:
    'In adults, does long-term consumption of aspartame increase cancer incidence compared with low or no consumption?',
  query: 'aspartame cancer humans',
  studies: SAMPLE_STUDIES,
  selectedIds: [],
  synthesis:
    'The current evidence does not support a simple causal claim. Study design, exposure measurement, dose, and population all change how confidently the findings can be interpreted.',
  nextQuestion:
    'Which long-term studies separate specific sweeteners, doses, and cancer outcomes while accounting for reverse causation?'
};

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: Sparkles },
  { key: 'research', label: 'Research', icon: FlaskConical },
  { key: 'studies', label: 'Evidence', icon: BookOpen },
  { key: 'wheel', label: 'Claim wheel', icon: Scale },
  { key: 'tensions', label: 'Tensions', icon: CircleHelp },
  { key: 'export', label: 'Dossier', icon: Download }
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...DEFAULT_STATE, ...saved } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function App() {
  const [project, setProject] = useState(loadState);
  const [activeView, setActiveView] = useState('research');
  const [busy, setBusy] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const selected = useMemo(
    () => project.studies.filter((study) => project.selectedIds.includes(study.pmid)),
    [project.studies, project.selectedIds]
  );

  const scores = useMemo(() => {
    const next = Object.fromEntries(CATEGORIES.map(({ key }) => [key, 0]));
    selected.forEach((study) => {
      next[study.category] = Math.min(3, (next[study.category] || 0) + 1);
      if (study.year >= new Date().getFullYear() - 2) next.recent = Math.min(3, next.recent + 1);
    });
    const hasCounterEvidence = selected.some((study) => study.relevance === 'challenges');
    const missingReviews = selected.length > 0 && !selected.some((study) => study.category === 'review');
    if (hasCounterEvidence || missingReviews) next.gap = Math.min(3, Number(hasCounterEvidence) + Number(missingReviews));
    return next;
  }, [selected]);

  const progress = Math.min(
    100,
    15 +
      (project.researchQuestion.trim() ? 15 : 0) +
      Math.min(selected.length, 4) * 12.5 +
      (selected.some((study) => study.relevance === 'challenges') ? 10 : 0) +
      (project.synthesis.trim() ? 10 : 0)
  );

  function updateProject(changes) {
    setProject((current) => ({ ...current, ...changes }));
  }

  function updateStudy(pmid, changes) {
    setProject((current) => ({
      ...current,
      studies: current.studies.map((study) => (study.pmid === pmid ? { ...study, ...changes } : study))
    }));
  }

  function toggleStudy(pmid) {
    setProject((current) => ({
      ...current,
      selectedIds: current.selectedIds.includes(pmid)
        ? current.selectedIds.filter((id) => id !== pmid)
        : [...current.selectedIds, pmid]
    }));
  }

  async function runSearch(event) {
    event.preventDefault();
    if (!project.query.trim()) return;
    setBusy(true);
    setNotice('');
    try {
      const endpoint = import.meta.env.VITE_PUBMED_API_URL;
      if (!endpoint) throw new Error('offline');
      const separator = endpoint.includes('?') ? '&' : '?';
      const response = await fetch(`${endpoint}${separator}q=${encodeURIComponent(project.query.trim())}`);
      if (!response.ok) throw new Error('offline');
      const data = await response.json();
      if (!data.items?.length) {
        setNotice('No records matched. Try broader terms or remove one concept.');
      } else {
        updateProject({ studies: data.items, selectedIds: [] });
        setNotice(`${data.items.length} PubMed records found. Classify the most useful evidence before adding it.`);
      }
    } catch {
      updateProject({ studies: SAMPLE_STUDIES });
      setNotice('Live PubMed is not connected in this preview, so a curated practice set is shown.');
    } finally {
      setBusy(false);
    }
  }

  function navigate(key) {
    setActiveView(key);
    setMobileNavOpen(false);
    document.querySelector('main')?.focus();
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to workspace</a>
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`} aria-label="Investigation sections">
        <button className="mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X /></button>
        <div className="brand-lockup">
          <div className="brand-mark"><Leaf size={25} /></div>
          <span>Evidence<br />Studio</span>
        </div>
        <nav>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button key={key} className={activeView === key ? 'active' : ''} onClick={() => navigate(key)}>
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-progress">
          <span>{Math.round(progress)}%</span>
          <div><i style={{ width: `${progress}%` }} /></div>
          <small>Investigation progress</small>
        </div>
      </aside>

      <div className="page">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu /></button>
          <div className="investigation-title">
            <small>Investigation</small>
            <h1>{project.claim}</h1>
          </div>
          <span className="saved"><Check size={15} /> Saved locally</span>
        </header>

        <main id="main-content" tabIndex="-1">
          {activeView === 'overview' && (
            <Overview project={project} selected={selected} progress={progress} onNavigate={navigate} />
          )}
          {activeView === 'research' && (
            <ResearchView
              project={project}
              busy={busy}
              notice={notice}
              selectedIds={project.selectedIds}
              onSearch={runSearch}
              onUpdateProject={updateProject}
              onUpdateStudy={updateStudy}
              onToggleStudy={toggleStudy}
              onEditClaim={() => setShowEditor(true)}
            />
          )}
          {activeView === 'studies' && (
            <EvidenceView selected={selected} onNavigate={navigate} onUpdateStudy={updateStudy} onToggleStudy={toggleStudy} />
          )}
          {activeView === 'wheel' && (
            <WheelView project={project} selected={selected} scores={scores} onEditClaim={() => setShowEditor(true)} onNavigate={navigate} />
          )}
          {activeView === 'tensions' && (
            <TensionsView project={project} selected={selected} onUpdateProject={updateProject} onNavigate={navigate} />
          )}
          {activeView === 'export' && (
            <DossierView project={project} selected={selected} scores={scores} onNavigate={navigate} />
          )}
        </main>
      </div>

      {mobileNavOpen && <button className="nav-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}
      {showEditor && (
        <ClaimEditor project={project} onUpdate={updateProject} onClose={() => setShowEditor(false)} />
      )}
    </div>
  );
}

function PageIntro({ step, title, description, action }) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">{step}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Overview({ project, selected, progress, onNavigate }) {
  const challenges = selected.filter((study) => study.relevance === 'challenges').length;
  return (
    <section className="view-shell">
      <PageIntro step="01 · Overview" title="Follow the evidence, not the headline."
        description="Build a defensible position by refining the question, gathering varied evidence, and naming what the research still cannot answer." />
      <div className="hero-grid">
        <article className="overview-hero">
          <span className="kicker">Current research question</span>
          <h3>{project.researchQuestion}</h3>
          <button className="text-button" onClick={() => onNavigate('research')}>Continue investigating <ArrowRight /></button>
        </article>
        <article className="progress-card">
          <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` }}><span>{Math.round(progress)}%</span></div>
          <div><strong>Investigation health</strong><p>{selected.length < 3 ? 'Add more perspectives before drawing a conclusion.' : 'You have enough evidence to start mapping tensions.'}</p></div>
        </article>
      </div>
      <div className="metric-grid">
        <article><strong>{selected.length}</strong><span>studies on your wheel</span></article>
        <article><strong>{new Set(selected.map((study) => study.category)).size}</strong><span>evidence categories</span></article>
        <article><strong>{challenges}</strong><span>studies that challenge</span></article>
      </div>
      <div className="pathway">
        {['Refine a claim', 'Gather evidence', 'Classify studies', 'Compare tensions', 'Revise your position'].map((label, index) => (
          <div key={label} className={index === 0 || selected.length >= index ? 'done' : ''}><span>{index + 1}</span><p>{label}</p></div>
        ))}
      </div>
    </section>
  );
}

function ResearchView({ project, busy, notice, selectedIds, onSearch, onUpdateProject, onUpdateStudy, onToggleStudy, onEditClaim }) {
  return (
    <section className="view-shell">
      <PageIntro step="02 · Research" title="Research Garden"
        description="Search biomedical literature, inspect what each study can establish, and choose the evidence that deserves a place in your investigation." />
      <div className="claim-card">
        <div><small>Your refined research question</small><p>{project.researchQuestion}</p></div>
        <button className="secondary-button" onClick={onEditClaim}>Refine question</button>
      </div>
      <form className="search-row" onSubmit={onSearch}>
        <Search size={21} aria-hidden="true" />
        <input value={project.query} onChange={(event) => onUpdateProject({ query: event.target.value })} aria-label="Search PubMed" placeholder="Search concepts, population, or outcome" />
        <button disabled={busy}>{busy ? 'Searching…' : 'Search PubMed'}</button>
      </form>
      <div className="search-hints"><span>Try:</span>{['aspartame neoplasms cohort', 'non-nutritive sweetener review', 'aspartame animal carcinogenicity'].map((term) => <button key={term} onClick={() => onUpdateProject({ query: term })}>{term}</button>)}</div>
      {notice && <div className="notice" role="status">{notice}</div>}
      <div className="results-heading"><div><h3>{project.studies.length} evidence leads</h3><p>Classify before you collect. Your judgment is part of the work.</p></div><span>{selectedIds.length} selected</span></div>
      <div className="study-grid">
        {project.studies.map((study) => (
          <StudyCard key={study.pmid} study={study} selected={selectedIds.includes(study.pmid)}
            onUpdate={(changes) => onUpdateStudy(study.pmid, changes)}
            onToggle={() => onToggleStudy(study.pmid)} />
        ))}
      </div>
    </section>
  );
}

function EvidenceView({ selected, onNavigate, onUpdateStudy, onToggleStudy }) {
  return (
    <section className="view-shell">
      <PageIntro step="03 · Evidence" title="Evidence collection"
        description="This is the focused set you will use to evaluate the claim. Add a note that captures why each source belongs."
        action={<button className="secondary-button" onClick={() => onNavigate('research')}>Add more evidence</button>} />
      {!selected.length ? <EmptyState title="Your collection is empty." body="Return to the Research Garden and add the studies that best help you test the claim." onClick={() => onNavigate('research')} /> :
        <div className="evidence-list">
          {selected.map((study) => (
            <article key={study.pmid}>
              <div className={`evidence-index ${study.category}`}>{study.category.slice(0, 1).toUpperCase()}</div>
              <div><span className="evidence-type">{study.type} · {study.year}</span><h3>{study.title}</h3><p>{study.summary}</p>
                <label className="note-field">Investigator note<textarea value={study.note || ''} onChange={(event) => onUpdateStudy(study.pmid, { note: event.target.value })} placeholder="What can this study contribute—and what can it not prove?" /></label>
              </div>
              <button className="icon-button" onClick={() => onToggleStudy(study.pmid)} aria-label={`Remove ${study.title}`}><X /></button>
            </article>
          ))}
        </div>}
    </section>
  );
}

function WheelView({ project, selected, scores, onEditClaim, onNavigate }) {
  return (
    <section className="view-shell wheel-view">
      <PageIntro step="04 · Claim wheel" title="See the shape of your evidence."
        description="Coverage is not certainty. The wheel reveals which evidence types you have examined and where your investigation remains thin." />
      <div className="wheel-layout">
        <ClaimWheel claim={project.claim} scores={scores} onRevise={onEditClaim} />
        <div className="wheel-insights">
          <span className="kicker">Reading the wheel</span>
          <h3>{selected.length ? `${selected.length} sources reveal ${Object.values(scores).filter(Boolean).length} active dimensions.` : 'Your wheel is waiting for evidence.'}</h3>
          <p>{selected.length < 3 ? 'A credible investigation needs multiple methods and points of view. Add at least three sources before interpreting the pattern.' : 'The pattern is broad enough to compare. Now look for disagreement in methods, populations, and outcomes.'}</p>
          <div className="semantic-scores" aria-label="Claim wheel scores">
            {CATEGORIES.map((category) => <div key={category.key}><span><i className={`dot ${category.key}`} />{category.label}</span><strong>{scores[category.key] || 0} / 3</strong></div>)}
          </div>
          <button className="primary-button" onClick={() => onNavigate(selected.length >= 2 ? 'tensions' : 'research')}>{selected.length >= 2 ? 'Map evidence tensions' : 'Gather evidence'} <ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

function TensionsView({ project, selected, onUpdateProject, onNavigate }) {
  const support = selected.filter((study) => study.relevance === 'supports');
  const challenge = selected.filter((study) => study.relevance === 'challenges');
  const nuance = selected.filter((study) => ['complicates', 'context'].includes(study.relevance));
  return (
    <section className="view-shell">
      <PageIntro step="05 · Tensions" title="Contradiction is a clue."
        description="Place findings in conversation. Differences in method, population, exposure, or outcome often explain why studies appear to disagree." />
      {selected.length < 2 ? <EmptyState title="Add one more perspective." body="You need at least two selected studies before a meaningful comparison is possible." onClick={() => onNavigate('research')} /> :
        <>
          <div className="tension-grid">
            <TensionColumn title="Supports" tone="supports" studies={support} empty="No selected evidence currently supports the claim." />
            <TensionColumn title="Challenges" tone="challenges" studies={challenge} empty="No selected evidence currently challenges the claim." />
            <TensionColumn title="Complicates" tone="complicates" studies={nuance} empty="No selected evidence currently adds context or nuance." />
          </div>
          <div className="reflection-panel">
            <div><span className="kicker">Synthesis studio</span><h3>What are you now willing to claim?</h3><p>Use appropriately cautious language. Name the strongest evidence and the most consequential limitation.</p></div>
            <label>Working synthesis<textarea value={project.synthesis} onChange={(event) => onUpdateProject({ synthesis: event.target.value })} /></label>
            <label>Most important next question<textarea value={project.nextQuestion} onChange={(event) => onUpdateProject({ nextQuestion: event.target.value })} /></label>
            <button className="primary-button" onClick={() => onNavigate('export')}>Review dossier <ChevronRight /></button>
          </div>
        </>}
    </section>
  );
}

function TensionColumn({ title, tone, studies, empty }) {
  return (
    <section className={`tension-column ${tone}`}>
      <header><span>{studies.length}</span><h3>{title}</h3></header>
      {studies.length ? studies.map((study) => <article key={study.pmid}><small>{study.type} · {study.year}</small><h4>{study.title}</h4><p>{study.note || study.summary}</p></article>) : <p className="column-empty">{empty}</p>}
    </section>
  );
}

function DossierView({ project, selected, scores, onNavigate }) {
  return (
    <section className="view-shell dossier-view">
      <PageIntro step="06 · Dossier" title="Your evidence-informed position"
        description="Review the reasoning trail, then print or save it as a PDF for discussion, assessment, or revision."
        action={<button className="primary-button print-button" onClick={() => window.print()}><Printer /> Print / save PDF</button>} />
      <article className="dossier">
        <header><div className="brand-mark small"><Leaf size={20} /></div><div><span>Evidence Studio · Investigation dossier</span><h2>{project.claim}</h2><p>{project.researchQuestion}</p></div></header>
        <section><span className="dossier-number">01</span><div><h3>Evidence-informed position</h3><p className="synthesis">{project.synthesis || 'A synthesis has not been written yet.'}</p></div></section>
        <section><span className="dossier-number">02</span><div><h3>Evidence reviewed</h3>
          {selected.length ? <div className="dossier-studies">{selected.map((study) => <article key={study.pmid}><span>{study.type} · {study.year} · PMID {study.pmid}</span><h4>{study.title}</h4><p>{study.note || study.summary}</p></article>)}</div> : <p>No evidence has been selected.</p>}
        </div></section>
        <section><span className="dossier-number">03</span><div><h3>Coverage and gaps</h3><div className="score-strip">{CATEGORIES.map((category) => <span key={category.key}><i className={`dot ${category.key}`} />{category.label}<b>{scores[category.key] || 0}/3</b></span>)}</div></div></section>
        <section><span className="dossier-number">04</span><div><h3>What to investigate next</h3><p>{project.nextQuestion || 'No next question has been recorded.'}</p></div></section>
        <footer>This dossier records the investigator’s reasoning. It is not medical advice or a clinical recommendation.</footer>
      </article>
      {!selected.length && <button className="text-button centered" onClick={() => onNavigate('research')}>Add evidence before exporting <ArrowRight /></button>}
    </section>
  );
}

function EmptyState({ title, body, onClick }) {
  return <div className="empty-state"><Leaf /><h3>{title}</h3><p>{body}</p><button className="primary-button" onClick={onClick}>Go to Research Garden <ArrowRight /></button></div>;
}

function ClaimEditor({ project, onUpdate, onClose }) {
  const [claim, setClaim] = useState(project.claim);
  const [researchQuestion, setResearchQuestion] = useState(project.researchQuestion);
  function save() {
    onUpdate({ claim: claim.trim() || project.claim, researchQuestion: researchQuestion.trim() || project.researchQuestion });
    onClose();
  }
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="claim-editor-title">
        <button className="close" onClick={onClose} aria-label="Close claim editor"><X /></button>
        <small>Claim studio</small>
        <h2 id="claim-editor-title">Make the claim researchable.</h2>
        <p>Separate a broad headline from the precise question you can actually investigate.</p>
        <label>Original claim<input value={claim} onChange={(event) => setClaim(event.target.value)} /></label>
        <label>Refined research question<textarea value={researchQuestion} onChange={(event) => setResearchQuestion(event.target.value)} /></label>
        <div className="modal-tip"><strong>A useful question names:</strong> population · exposure or intervention · comparison · outcome</div>
        <button className="primary-button" onClick={save}>Use this question</button>
      </div>
    </div>
  );
}

export default App;
