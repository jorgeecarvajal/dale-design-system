import React from 'react';

const CHECK = 'M9.55 17.6 4.4 12.45l1.275-1.275L9.55 15.05l8.775-8.775L19.6 7.55Z';
const DASH = 'M6 12.75v-1.5h12v1.5Z';

/** Dale checkbox — M3 geometry with the brand's accent red, as painted in the source. */
export function Checkboxes({
  checked = false, indeterminate = false, disabled = false, error = false,
  tone = 'var(--dale-accent)', onChange, id, label, style, className, ...rest
}) {
  const on = checked || indeterminate;
  const ink = error ? 'var(--dale-accent)' : tone;
  const box = (
    <span style={{
      position: 'relative', width: 40, height: 40, borderRadius: 100, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.38 : 1,
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 2, flexShrink: 0,
        background: on ? ink : 'transparent',
        boxShadow: on ? 'none' : `inset 0 0 0 2px ${error ? 'var(--dale-accent)' : 'var(--dale-gray-hard)'}`,
      }} />
      {on && (
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', left: 8, top: 8, color: 'var(--dale-white)' }} aria-hidden="true">
          <path d={indeterminate ? DASH : CHECK} fill="currentColor" />
        </svg>
      )}
    </span>
  );
  return (
    <label htmlFor={id} className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: disabled ? 'default' : 'pointer', ...style }}>
      <input
        id={id} type="checkbox" checked={checked} disabled={disabled}
        onChange={onChange} readOnly={!onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {box}
      {label && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.4, color: disabled ? 'var(--text-disabled-default)' : 'var(--gray-900)' }}>{label}</span>}
    </label>
  );
}
export default Checkboxes;
