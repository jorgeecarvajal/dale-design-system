import React from 'react';
import { DaleLogo } from '../brand/DaleLogo.jsx';
import { Icon } from '../icons/Icon.jsx';
import { DashboardItem } from './DashboardItem.jsx';
import { OperationsItem } from './OperationsItem.jsx';
import { MerchantsItem } from './MerchantsItem.jsx';
import { AgentNetworkItem } from './AgentNetworkItem.jsx';
import { AggregatorsItem } from './AggregatorsItem.jsx';
import { ReconciliationItem } from './ReconciliationItem.jsx';
import { SettlementsItem } from './SettlementsItem.jsx';
import { PricingItem } from './PricingItem.jsx';
import { MonitoringItem } from './MonitoringItem.jsx';
import { AccessItem } from './AccessItem.jsx';

const ITEMS = [
  ['dashboard', DashboardItem],
  ['operations', OperationsItem],
  ['merchants', MerchantsItem],
  ['agent-network', AgentNetworkItem],
  ['aggregators', AggregatorsItem],
  ['reconciliation', ReconciliationItem],
  ['settlements', SettlementsItem],
  ['pricing', PricingItem],
  ['access', AccessItem],
  ['config', MonitoringItem],
];

/** The Dale admin sidebar: 250px dark rail, logo, collapse control, ten sections. Collapses to an 80px icon rail. */
export function Sidebar({ active = 'dashboard', onSelect, collapsed, defaultCollapsed = false, onCollapse, style, className, ...rest }) {
  const [inner, setInner] = React.useState(defaultCollapsed);
  const isCollapsed = collapsed ?? inner;
  const W = isCollapsed ? 80 : 250;
  const toggle = () => { if (collapsed === undefined) setInner(!isCollapsed); onCollapse && onCollapse(!isCollapsed); };
  return (
    <div
      className={className}
      style={{
        width: W, flexShrink: 0, alignSelf: 'stretch', boxSizing: 'border-box', transition: 'width 200ms ease', overflowX: 'hidden',
        background: 'var(--surface-sidebar)', border: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 0',
        alignItems: 'flex-start', ...style,
      }}
      {...rest}
    >
      <div style={{ width: W, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', flexShrink: 0 }}>
        <div style={{
          height: 70, boxSizing: 'border-box', alignSelf: 'stretch', overflow: 'hidden',
          display: 'flex', flexDirection: 'row', padding: '0 10px', justifyContent: 'center', alignItems: 'center',
        }}>
          {!isCollapsed && <div style={{ flexGrow: 1, alignSelf: 'stretch', display: 'flex', gap: 10, padding: 10, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <DaleLogo width={130} />
          </div>}
          <div style={{ width: isCollapsed ? 'auto' : 37, alignSelf: 'stretch', boxSizing: 'border-box', display: 'flex', padding: '10px 5px', justifyContent: isCollapsed ? 'center' : 'flex-end', alignItems: 'center' }}>
            <button
              type="button"
              onClick={toggle}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease', width: 22, height: 22, padding: 0, border: 0, background: 'none', color: 'var(--dale-gray-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="NavSidebarCollapse" size={20} />
            </button>
          </div>
        </div>
        {ITEMS.map(([key, Item]) => (
          <Item
            key={key}
            state={active === key ? 'hover' : 'default'}
            collapsed={isCollapsed}
            onClick={onSelect ? () => onSelect(key) : undefined}
            style={{ alignSelf: 'stretch', width: 'auto' }}
          />
        ))}
      </div>
    </div>
  );
}
export default Sidebar;
