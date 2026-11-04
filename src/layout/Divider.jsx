import React from 'react';

/**
 * Hairline rule. `full-width` = the source's `Horizontal/Full-width`;
 * `middle-inset` = `Horizontal/Middle-inset` (52:14388): 16px side inset,
 * 1px #CAC4D0.
 */
export function Divider({ variant = 'full-width', tone, style, className, ...rest }) {
  const inset = variant === 'middle-inset';
  const color = tone || (inset ? 'var(--dale-outline-variant)' : 'var(--dale-border-cool)');
  return (
    <div role="separator" className={className}
      style={{ alignSelf: 'stretch', flexShrink: 0, padding: inset ? '0 16px' : 0, boxSizing: 'border-box', ...style }} {...rest}>
      <div style={{ height: 1, background: color }} />
    </div>
  );
}
export default Divider;

/** Aliases under the kit's own symbol names. Same component. */
export const HorizontalFullWidth = (p) => <Divider {...p} variant="full-width" />;
export const HorizontalMiddleInset = (p) => <Divider {...p} variant="middle-inset" />;
