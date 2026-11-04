import React from 'react';

const TONE = {
  default: { border: 'var(--border-field)', bg: 'var(--surface-card)', label: 'var(--gray-900)' },
  error: { border: 'var(--border-danger-default)', bg: 'var(--surface-card)', label: 'var(--gray-900)' },
  disabled: { border: 'var(--border-disabled-default)', bg: 'var(--background-disabled-default)', label: 'var(--text-disabled-default)' },
};

/** Dale form field. 3 states × 2 value types, exactly as in the source. */
export function InputField({
  state = 'default', valueType = 'default', label = 'Label', value = 'Value',
  description, error, hasLabel = true, onChange, style, className, ...rest
}) {
  const t = TONE[state] || TONE.default;
  const placeholder = valueType === 'placeholder';
  const valueColor = state === 'disabled'
    ? 'var(--text-disabled-on-disabled)'
    : placeholder ? 'var(--text-default-tertiary)' : 'var(--gray-900)';
  const base = { fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: 16, lineHeight: 1.4 };
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', minWidth: 120, ...style }} {...rest}>
      {hasLabel && <span style={{ ...base, alignSelf: 'stretch', color: t.label }}>{label}</span>}
      {description && <span style={{ ...base, alignSelf: 'stretch', color: 'var(--text-default-secondary)' }}>{description}</span>}
      <div style={{
        height: 40, minWidth: 120, alignSelf: 'stretch', boxSizing: 'border-box', overflow: 'hidden',
        borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'row', padding: '12px 16px', alignItems: 'center',
      }}>
        <input
          value={value}
          onChange={onChange}
          disabled={state === 'disabled'}
          readOnly={!onChange}
          style={{
            ...base, lineHeight: 1, flexGrow: 1, minWidth: 0, border: 0, outline: 'none',
            background: 'transparent', color: valueColor, padding: 0,
          }}
        />
      </div>
      {error && <span style={{ ...base, whiteSpace: 'nowrap', color: state === 'error' ? 'var(--text-danger-default)' : 'var(--gray-900)' }}>{error}</span>}
    </div>
  );
}
export default InputField;
