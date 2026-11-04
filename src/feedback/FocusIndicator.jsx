import React from 'react';

/** Focus ring — a 3px outer ring, drawn outside the element it marks. */
export function FocusIndicator({
  radius = 2, tone = 'var(--dale-dark)', inset = -2, style, className, ...rest
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute', left: inset, top: inset, right: inset, bottom: inset,
        borderRadius: radius, boxShadow: `0 0 0 3px ${tone}`, pointerEvents: 'none',
        ...style,
      }}
      {...rest}
    />
  );
}
export default FocusIndicator;
