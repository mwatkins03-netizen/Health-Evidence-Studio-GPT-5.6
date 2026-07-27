# Evidence Studio — Design Brief

## Product idea
Evidence Studio is an educational health-claim investigation environment. Students start with a broad claim, refine it into a researchable question, search PubMed/PMC, classify sources, compare tensions, and revise the claim themselves.

The system must not produce a final true/false verdict. Its role is to retrieve, organize, expose gaps, and support disciplined reasoning.

## Visual direction
The interface draws from the supplied DiffUI visual language: warm editorial paper, dark navy, olive green, terracotta, brass details, botanical/scientific line work, restrained borders, and serif display typography.

### Design tokens
- Paper: `#F5F0E6`
- Paper light: `#FBF8F1`
- Navy: `#14253B`
- Olive: `#6F7742`
- Terracotta: `#B55C37`
- Brass: `#AA7A2B`
- Stone: `#B8AE9D`
- Rule: `#D8CFBF`

### Typography
- Display: Georgia or an editorial serif such as Cormorant Garamond / Libre Baskerville.
- UI/body: system sans, Inter, or Source Sans 3.
- Minimum desktop body: 18px.
- Major page headings: 40–56px.
- Study titles: 22–28px.

## Signature interaction: Claim Wheel
The Claim Wheel replaces the earlier pottery-vessel metaphor.

The wheel borrows the *physical action* of a potter's wheel rather than its object. Students shape their claim by gathering stronger and more diverse evidence. Each radial sector represents an evidence dimension, while concentric depth indicates how much relevant material the student has actually examined.

The wheel is explicitly **not a truth meter**.

Suggested sectors:
1. Human studies
2. Reviews / synthesis
3. Animal / mechanistic evidence
4. Recent research
5. Context, uncertainty, and gaps

A balanced-looking wheel should never be labeled “true.” It means the student has examined a broader evidence base.

## Screen system
1. Claim Bench — refine a vague health claim.
2. Research Garden — search NCBI and filter evidence.
3. Study Specimen — inspect one study and annotate relevance/limitations.
4. Claim Wheel — map selected evidence.
5. Tensions — compare conflicting findings.
6. Revise — write the strongest claim the evidence supports.
7. Export — produce evidence dossier / printable submission.

## Interaction rule
Database metadata and student interpretation must look different.
- Navy = source/database metadata
- Olive = student judgment
- Terracotta = uncertainty / contradiction

## Accessibility
- Never encode evidence type by color alone.
- Full keyboard navigation.
- Visible focus styles.
- Reduced-motion mode for any rotating-wheel animation.
- Minimum 4.5:1 text contrast.
- Claim wheel must have a semantic text/table equivalent.
