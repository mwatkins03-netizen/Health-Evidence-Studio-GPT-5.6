import React from 'react';

export const CATEGORIES = [
  { key: 'human', label: 'Human studies' },
  { key: 'review', label: 'Reviews' },
  { key: 'animal', label: 'Animal / mechanistic' },
  { key: 'recent', label: 'Recent research' },
  { key: 'gap', label: 'Context & gaps' }
];

export default function ClaimWheel({ claim, scores, onRevise }) {
  const center = 180;
  const rings = [112, 132, 152];
  const wedge = 360 / CATEGORIES.length;
  const polar = (radius, angle) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return [center + radius * Math.cos(radians), center + radius * Math.sin(radians)];
  };
  const arc = (innerRadius, outerRadius, startAngle, endAngle) => {
    const [x1, y1] = polar(innerRadius, startAngle);
    const [x2, y2] = polar(outerRadius, startAngle);
    const [x3, y3] = polar(outerRadius, endAngle);
    const [x4, y4] = polar(innerRadius, endAngle);
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  return (
    <div className="wheel-wrap">
      <svg viewBox="0 0 360 360" className="claim-wheel" role="img" aria-label={`Evidence coverage wheel for: ${claim}`}>
        <circle cx="180" cy="180" r="160" className="wheel-outline" />
        {[0, 1, 2].map((level) =>
          CATEGORIES.map((category, index) => {
            const strength = Math.min(3, Math.max(0, scores[category.key] || 0));
            const startAngle = index * wedge + 2;
            const endAngle = (index + 1) * wedge - 2;
            const innerRadius = level === 0 ? 92 : rings[level - 1];
            return <path key={`${category.key}-${level}`} d={arc(innerRadius, rings[level], startAngle, endAngle)} className={level < strength ? `wheel-segment filled ${category.key}` : 'wheel-segment'} />;
          })
        )}
        {CATEGORIES.map((category, index) => {
          const [x, y] = polar(170, index * wedge + wedge / 2);
          return <circle key={category.key} cx={x} cy={y} r="5" className="wheel-pin" />;
        })}
        <circle cx="180" cy="180" r="78" className="wheel-center" />
        <foreignObject x="109" y="121" width="142" height="118">
          <div xmlns="http://www.w3.org/1999/xhtml" className="wheel-copy">
            <span>Your claim</span>
            <strong>{claim}</strong>
            <button onClick={onRevise}>Revise claim</button>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
