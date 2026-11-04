import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const IDLE = 'var(--nav-idle)';
const ACTIVE = 'var(--nav-active)';

/**
 * Shared implementation behind the ten Dale sidebar item families.
 * state="default" → Inter 500, Gray Light. state="hover" → Inter 800, yellow,
 * with the 6px yellow rail. Pass `flyout` to render the dark sub-menu panel.
 */
export function SidebarItem({
  icon, label, state = 'default', collapsed = false, flyout, flyoutTitle, onClick, style, className, ...rest
}) {
  const active = state === 'hover';
  const tone = active ? ACTIVE : IDLE;
  return (
    <div
      className={className}
      onClick={onClick}
      title={collapsed ? label : undefined}
      style={{
        position: 'relative', width: collapsed ? 80 : 250, height: 50, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20,
        padding: collapsed ? 0 : '0 40px', justifyContent: collapsed ? 'center' : undefined, cursor: onClick ? 'pointer' : undefined,
        color: tone, ...style,
      }}
      {...rest}
    >
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: 0, width: 6, height: 50,
          borderRadius: 'var(--radius-indicator)', background: ACTIVE,
        }} />
      )}
      <div style={{ width: 25, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
        <Icon name={`Nav${icon}`} size={20} style={{ color: tone }} />
      </div>
      {!collapsed && <span style={{
        fontFamily: 'var(--font-ui)', fontWeight: active ? 800 : 500, fontSize: 18,
        lineHeight: '100%', whiteSpace: 'nowrap', color: tone, flexShrink: 0,
      }}>{label}</span>}
      {active && flyout && flyout.length > 0 && (
        <div style={{
          position: 'absolute', left: collapsed ? 80 : 250, top: 0, width: 220, boxSizing: 'border-box',
          borderRadius: 16, background: 'var(--surface-flyout)',
          boxShadow: 'var(--shadow-flyout-ring), var(--shadow-flyout)',
          display: 'flex', flexDirection: 'column', gap: 12, padding: 16,
          justifyContent: 'center', alignItems: 'center', zIndex: 20,
        }}>
          <div style={{ height: 19, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
            <span style={{
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
              lineHeight: '100%', whiteSpace: 'nowrap', color: 'var(--text-on-dark)',
            }}>{flyoutTitle ?? label}</span>
          </div>
          <div style={{ height: 1, background: 'var(--border-on-dark)', alignSelf: 'stretch' }} />
          {flyout.map((item) => (
            <div key={item} style={{
              height: 38, boxSizing: 'border-box', alignSelf: 'stretch',
              borderRadius: 12, background: 'rgba(254,230,0,0.0784)',
              display: 'flex', flexDirection: 'row', gap: 12, padding: '10px 12px', alignItems: 'center',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACTIVE, flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15,
                lineHeight: '100%', whiteSpace: 'nowrap', color: 'var(--text-on-dark)',
              }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default SidebarItem;
