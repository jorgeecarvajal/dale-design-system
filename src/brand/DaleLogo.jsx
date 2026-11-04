import React from 'react';
import { daleLogo } from './logo-data.js';

/** The dale lockup: yellow pill, wordmark, three red chevrons. Fixed colours. */
export function DaleLogo({ width = 130, style, className, ...rest }) {
  const ratio = 95.677 / 287.558;
  return (
    <svg
      role="img"
      aria-label="dale"
      viewBox={daleLogo.viewBox}
      width={width}
      height={Math.round(width * ratio * 100) / 100}
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: daleLogo.body }}
      {...rest}
    />
  );
}
export default DaleLogo;
