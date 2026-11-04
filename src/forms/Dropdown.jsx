import React from 'react';
import { Icon } from '../icons/Icon.jsx';

/**
 * `Dropdown` (55:331) — label Inter 700/12 #1E1E1E, 8px gap, 44px input
 * (radius 8, 1px #D9D9D9, 12/16 padding, Inter 16 value, 20px arrow-down #757575),
 * options panel (radius 8, 1px #D9D9D9) of 43px `Option` rows on #F5F6F6.
 */
export function Dropdown({
  label = 'Country', options = ['Dominican Republic', 'El Salvador', 'Nicaragua'],
  value, defaultValue, onChange, open: openProp, defaultOpen = false, dense = false, style, className, ...rest
}) {
  const [inner, setInner] = React.useState(defaultValue ?? options[0]);
  const [openInner, setOpen] = React.useState(defaultOpen);
  const cur = value ?? inner;
  const open = openProp ?? openInner;
  const pick = (o) => { setInner(o); setOpen(false); onChange && onChange(o); };
  const text = { fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: dense ? 14 : 16, lineHeight: 1, color: 'var(--gray-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const box = { borderRadius: 8, background: 'var(--dale-white)', border: '1px solid var(--gray-300)', boxSizing: 'border-box', overflow: 'hidden', alignSelf: 'stretch' };
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', ...style }} {...rest}>
      {label && <span style={{ alignSelf: 'stretch', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12, lineHeight: '100%', color: 'var(--gray-900)' }}>{label}</span>}
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}
        style={{ ...box, height: dense ? 40 : 44, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, padding: dense ? '0 12px' : '12px 16px', minWidth: 0, margin: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ ...text, flexGrow: 1, minWidth: 0 }}>{cur}</span>
        <Icon name="VuesaxOutlineArrowDown" size={dense ? 16 : 20} style={{ color: 'var(--gray-500)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 120ms ease' }} />
      </button>
      {open && (
        <div role="listbox" style={{ ...box, display: 'flex', flexDirection: 'column' }}>
          {options.map((o) => (
            <div key={o} role="option" aria-selected={o === cur} onClick={() => pick(o)}
              style={{ height: dense ? 36 : 43, display: 'flex', alignItems: 'center', padding: dense ? '0 12px' : '12px 16px', boxSizing: 'border-box', background: 'var(--dale-sensitive-warm)', cursor: 'pointer', ...text, fontWeight: o === cur ? 600 : 400 }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Dropdown;
