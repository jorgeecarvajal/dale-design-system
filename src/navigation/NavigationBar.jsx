import React from 'react';

/**
 * Tab strip — `Navigation Bar` (5 variants, Cantidad = 3…6) + `Navigation Bar / Pestaña` (65:463).
 * Each tab 120×30, labels centred, Inter 400/16 in #ABBED1; 40px gap; 1px #F5F6F6 base line at y=29.
 */
export function NavigationBar({ tabs = ['Home', 'Edit Profile', 'Bank Accounts'], active, onChange, style, className, ...rest }) {
  return (
    <div role="tablist" className={className} style={{ position: 'relative', height: 30, alignSelf: 'stretch', ...style }} {...rest}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 29, height: 1, background: 'var(--dale-sensitive-warm)' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: 40, height: 30, alignItems: 'flex-start' }}>
        {tabs.map((t, i) => {
          const on = active === i;
          return (
            <button key={i} role="tab" aria-selected={on} type="button" onClick={() => onChange && onChange(i)}
              style={{
                position: 'relative', width: 120, height: 30, flexShrink: 0, padding: 0, margin: 0, border: 0, background: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: onChange ? 'pointer' : 'default',
                fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: 16, lineHeight: '100%', whiteSpace: 'nowrap',
                color: on ? 'var(--dale-tab-active)' : 'var(--dale-gray-blue)',
              }}>
              {t}
              {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, borderRadius: '10px 10px 0 0', background: 'var(--dale-tab-active)' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default NavigationBar;

/** Alias under the tab symbol's kit name. */
export const NavigationBarPestaA = ({ children = 'Edit Profile', ...p }) => <NavigationBar tabs={[children]} {...p} />;
