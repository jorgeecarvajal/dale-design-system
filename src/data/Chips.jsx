import React from 'react';

/* RevF "Chips" set (173:24137), Status = Completed | Pending | Cancelled | Failed.
   Grounds are the source's 15% tints of Dale palette colours. The source dot
   (#6750A4, an M3 leftover) and the Pending label (#F5F7FA, invisible on its
   tint) are replaced with palette values — see Chips.prompt.md. */
const TONE = {
  Completed: { bg: 'rgba(65,212,168,0.15)', dot: 'var(--dale-green-contrast)' },
  Pending: { bg: 'rgba(105,205,239,0.15)', dot: 'var(--dale-sky)' },
  Cancelled: { bg: 'rgba(137,147,158,0.15)', dot: 'var(--dale-gray-light)' },
  Failed: { bg: 'rgba(237,52,56,0.15)', dot: 'var(--dale-accent)' },
};

/** Status chip — pill with a 10px dot and a Gilroy ExtraBold 14px label. */
export function Chips({ status = 'Completed', label, size = 'default', style, className, ...rest }) {
  const t = TONE[status] || TONE.Cancelled;
  const sm = size === 'small';
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: sm ? 6 : 8,
        height: sm ? 22 : 25, padding: sm ? '0 10px' : '0 16px', boxSizing: 'border-box',
        borderRadius: 100, background: t.bg, whiteSpace: 'nowrap', verticalAlign: 'middle', ...style,
      }}
      {...rest}
    >
      <span style={{ width: sm ? 8 : 10, height: sm ? 8 : 10, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: sm ? 12 : 14, lineHeight: '100%', color: 'var(--dale-gray-medium)' }}>{label ?? status}</span>
    </span>
  );
}
export default Chips;
