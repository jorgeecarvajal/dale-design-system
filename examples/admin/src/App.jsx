/* The admin shell: Sidebar + one screen per section. Built from the Hi-Res frames
   (see README.md for which Figma node each screen recreates). */
import React, { useState } from 'react';
import { Sidebar } from '@dale/ui';
import { AgentNetworkScreen, AggregatorsScreen } from './screens/BusinessScreens.jsx';
import { PricingScreen } from './screens/PricingScreen.jsx';
import { ConfigScreen } from './screens/ConfigScreen.jsx';
import { PlaceholderScreen } from './screens/PlaceholderScreen.jsx';
import { DashboardScreen } from './screens/DashboardScreen.jsx';
import { OperationsScreen } from './screens/OperationsScreen.jsx';
import { ReconciliationScreen } from './screens/ReconciliationScreen.jsx';


export function App() {
  const [section, setSection] = useState(() => (location.hash.slice(1).split('/')[0] || 'operations'));
  React.useEffect(() => { if (location.hash.slice(1).split('/')[0] !== section) history.replaceState(null, '', '#' + section); }, [section]);
  React.useEffect(() => { document.querySelector('#root > div > div:last-child')?.scrollTo(0, 0); }, [section]);
  const [query, setQuery] = useState('');
  const screenProps = { query, onQuery: setQuery };
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', height: '100vh', overflow: 'hidden', background: 'var(--surface-app)' }}>
      <Sidebar active={section} onSelect={setSection} style={{ height: '100vh', overflowY: 'auto' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexGrow: 1, minWidth: 0, alignSelf: 'stretch', height: '100vh', overflowY: ['operations', 'reconciliation'].includes(section) ? 'hidden' : 'auto' }}>
        {section === 'dashboard' && <DashboardScreen {...screenProps} onNavigate={setSection} />}
        {section === 'aggregators' && <AggregatorsScreen key="agg" {...screenProps} />}
        {section === 'agent-network' && <AgentNetworkScreen key="an" {...screenProps} />}
        {section === 'pricing' && <PricingScreen {...screenProps} />}
        {section === 'config' && <ConfigScreen {...screenProps} />}
        {section === 'operations' && <OperationsScreen {...screenProps} />}
        {section === 'reconciliation' && <ReconciliationScreen {...screenProps} />}
        {!['dashboard', 'aggregators', 'agent-network', 'pricing', 'config', 'operations', 'reconciliation'].includes(section) && <PlaceholderScreen section={section} {...screenProps} />}
      </div>
    </div>
  );
}
