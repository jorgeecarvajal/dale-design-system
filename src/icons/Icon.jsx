import React from 'react';
import VUESAX from './icon-data.js';
import NAV from './nav-icon-data.js';
import M3 from './m3-icon-data.js';
import TABLE from './table-icon-data.js';

const ICONS = { ...VUESAX, ...NAV, ...M3, ...TABLE };

/** Vuesax glyph from the Dale icon library. Paints with currentColor. */
export function Icon({ name, size = 24, title, style, className, ...rest }) {
  const g = ICONS[name];
  if (!g) return null;
  return (
    <svg
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      viewBox={g.viewBox}
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', flexShrink: 0, color: 'currentColor', ...style }}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + g.body }}
      {...rest}
    />
  );
}

export const iconNames = Object.keys(ICONS);
/* Also hung off the component so @dsCard HTML can reach it through the
   bundled namespace, which only carries capitalised exports. */
Icon.names = iconNames;
export default Icon;
