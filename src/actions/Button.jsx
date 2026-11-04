import React from 'react';
import { Icon } from '../icons/Icon.jsx';

/* Trailing chevrons — the brand mark's own glyph, at x = 0 / 7.336 / 14.673
   inside a 22×12 box. Exact geometry from "Button - standard" (node 32:8844). */
const CHEVRON = 'M 2.193 0.257 L 6.915 5.057 C 7.421 5.743 7.506 6.514 6.915 7.114 L 2.277 11.829 L 2.108 12 L 0 9.857 L 3.795 6 L 0 2.143 L 2.108 0 L 2.193 0.257 Z';

function Chevrons({ dim }) {
  return (
    <span style={{ position: 'relative', width: 22, height: 12, flexShrink: 0, opacity: dim ? 0.4 : 1, color: 'var(--dale-accent)' }} aria-hidden="true">
      {[0, 7.336, 14.673].map((x) => (
        <svg key={x} width="7.327" height="12" viewBox="0 0 7.327 12" fill="none" style={{ position: 'absolute', left: x, top: 0 }}>
          <path d={CHEVRON} fill="currentColor" fillRule="evenodd" />
        </svg>
      ))}
    </span>
  );
}

/* Variant table transcribed from Dale_Mockup_20260919_RevD.fig.
   `dale`     — "Button - standard" 32:8844: Gilroy 800/14, trailing chevrons, 37px.
   the rest   — "Button standard|error|continue|secondary" 36:14176-9: 800/14 at
                20px line-height and 0.1 letter-spacing, optional leading 20px icon.
   Each variant carries its own ground and label ink — that colour pairing is
   what distinguishes them. */
const VARIANT = {
  dale:      { h: 37, bg: 'var(--dale-yellow)',        label: 'var(--text-on-brand-strong)', font: 'var(--font-display)', lh: '100%', ls: 'normal', chevrons: true },
  standard:  { h: 37, bg: 'var(--dale-yellow)',        label: 'var(--text-on-brand-strong)', font: 'var(--font-ui)', lh: '20px', ls: '0.1px', chevrons: false },
  error:     { h: 40, bg: 'var(--dale-accent-deep)',   label: 'var(--dale-sensitive-warm)',  font: 'var(--font-ui)', lh: '20px', ls: '0.1px', chevrons: false, defaultIcon: 'Close' },
  continue:  { h: 40, bg: 'var(--dale-green-contrast)', label: 'var(--text-on-brand-strong)', font: 'var(--font-ui)', lh: '20px', ls: '0.1px', chevrons: false, defaultIcon: 'VuesaxOutlineArrowRight2' },
  secondary: { h: 37, bg: 'var(--dale-sky)',           label: 'var(--text-on-brand-strong)', font: 'var(--font-ui)', lh: '20px', ls: '0.1px', chevrons: false },
};

/** The Dale button — a pill whose ground colour names its role. */
export function Button({
  children = 'Label', variant = 'dale', icon, tone,
  state, disabled = false, showChevrons, type = 'button', onClick, style, className, ...rest
}) {
  const v = VARIANT[variant] || VARIANT.dale;
  const off = disabled || state === 'disabled';
  const chevrons = showChevrons ?? v.chevrons;
  const glyph = icon !== undefined ? icon : (v.defaultIcon ? <Icon name={v.defaultIcon} size={20} /> : null);
  return (
    <button
      type={type}
      disabled={off}
      onClick={off ? undefined : onClick}
      className={className}
      style={{
        border: 0, padding: 0, margin: 0, background: 'none', appearance: 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: off ? 'default' : 'pointer', font: 'inherit',
        ...style,
      }}
      {...rest}
    >
      <span style={{
        display: 'inline-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '10px 16px', minHeight: v.h, boxSizing: 'border-box',
        borderRadius: 100, background: tone || v.bg, overflow: 'hidden',
        transition: 'filter 120ms ease',
      }}>
        {glyph && (
          <span style={{ display: 'inline-flex', width: 20, height: 20, flexShrink: 0, color: v.label, opacity: off ? 0.4 : 1 }} aria-hidden="true">{glyph}</span>
        )}
        <span style={{
          fontFamily: v.font, fontWeight: 800, fontSize: 14, lineHeight: v.lh, letterSpacing: v.ls,
          whiteSpace: 'nowrap', color: v.label, opacity: off ? 0.4 : 1,
        }}>{children}</span>
        {chevrons && <Chevrons dim={off} />}
      </span>
    </button>
  );
}
export default Button;
