import React from 'react';

/** Dale switch — 52×32 track; sky blue when on, as painted in the source. */
export function Switch({
  checked = false, disabled = false, tone = 'var(--dale-sky)',
  onChange, id, label, style, className, ...rest
}) {
  const track = (
    <span style={{
      position: 'relative', width: 52, height: 32, borderRadius: 100, flexShrink: 0,
      boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center',
      justifyContent: checked ? 'flex-end' : 'flex-start',
      padding: checked ? '2px 4px' : '2px 8px',
      background: checked ? tone : 'var(--dale-sensitive)',
      boxShadow: checked ? 'none' : 'inset 0 0 0 2px var(--dale-gray-light)',
      opacity: disabled ? 0.38 : 1,
      transition: 'background 140ms ease, padding 140ms ease',
    }}>
      <span style={{
        width: checked ? 24 : 16, height: checked ? 24 : 16, borderRadius: 24, flexShrink: 0,
        background: checked ? 'var(--dale-white)' : 'var(--dale-gray-light)',
        transition: 'width 140ms ease, height 140ms ease, background 140ms ease',
      }} />
    </span>
  );
  return (
    <label htmlFor={id} className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: disabled ? 'default' : 'pointer', ...style }}>
      <input
        id={id} type="checkbox" role="switch" checked={checked} disabled={disabled}
        onChange={onChange} readOnly={!onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {track}
      {label && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.4, color: disabled ? 'var(--text-disabled-default)' : 'var(--gray-900)' }}>{label}</span>}
    </label>
  );
}
export default Switch;
