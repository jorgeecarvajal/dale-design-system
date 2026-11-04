import React from 'react';
import { daleChevrons } from './logo-data.js';

/** The dale app icon: squircle ground + the three-chevron mark. */
export function FavIcon({ size = 109, background = 'var(--dale-yellow)', markColor = 'var(--dale-black-pure)', ring, style, className, ...rest }) {
  const s = size / 109;
  return (
    <div
      className={className}
      style={{
        position: 'relative', width: size, height: size, flexShrink: 0, overflow: 'hidden',
        borderRadius: 18.1667 * s, background,
        boxShadow: ring === 'dark' ? 'var(--shadow-app-icon-dark)' : ring === 'light' ? 'var(--shadow-app-icon-light)' : undefined,
        ...style,
      }}
      {...rest}
    >
      <svg
        role="img"
        aria-label="dale"
        viewBox={daleChevrons.viewBox}
        width={60.851 * s}
        height={32.77 * s}
        style={{ position: 'absolute', left: 24 * s, top: 39 * s, color: markColor }}
        dangerouslySetInnerHTML={{ __html: daleChevrons.body }}
      />
    </div>
  );
}
export default FavIcon;
