import React from 'react';

/** Dale dialog — 312px card at radius 28 on the brand yellow, as painted in the source. */
export function Dialog({
  open = true, title = 'Título', supportingText, icon, actions, children,
  align, surface = 'var(--dale-yellow)', onDismiss, style, className, ...rest
}) {
  if (!open) return null;
  const centered = align ? align === 'center' : Boolean(icon);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={className}
      style={{
        width: 312, minWidth: 280, maxWidth: 560, boxSizing: 'border-box', overflow: 'hidden',
        borderRadius: 28, background: surface, display: 'flex', flexDirection: 'column',
        ...style,
      }}
      {...rest}
    >
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16, padding: 24,
        alignItems: centered ? 'center' : 'flex-start',
      }}>
        {icon && <span style={{ width: 24, height: 24, flexShrink: 0, color: 'var(--text-on-brand)' }}>{icon}</span>}
        <span style={{
          fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: 24, lineHeight: '32px',
          textAlign: centered ? 'center' : 'left', color: 'var(--text-on-brand)', alignSelf: 'stretch',
        }}>{title}</span>
        {supportingText && (
          <span style={{
            fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: 14, lineHeight: '20px',
            letterSpacing: '0.25px', textAlign: centered ? 'center' : 'left',
            color: 'var(--text-on-brand)', alignSelf: 'stretch',
          }}>{supportingText}</span>
        )}
        {children && <div style={{ alignSelf: 'stretch' }}>{children}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: '24px 24px 24px 8px', alignItems: 'center', justifyContent: 'flex-end' }}>
        {actions}
      </div>
    </div>
  );
}
export default Dialog;

/** Alias under the kit's own set name (`XR/XR Dialog`). Same component. */
export const XRXRDialog = Dialog;
