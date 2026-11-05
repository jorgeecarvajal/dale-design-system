import React, { useState } from 'react';
import chevronsRed from '@dale/ui/assets/dale-chevrons-red.svg';
import { AdminHeader, ContentCard, DashboardBody } from './AdminChrome.jsx';

const UNDESIGNED = {
  operations: 'Operations', merchants: 'Merchants', 'agent-network': 'Agent Network',
  reconciliation: 'Reconciliation', settlements: 'Settlements', pricing: 'Pricing',
  access: 'Access', config: 'Config',
};

/** Sections that exist in the sidebar but have no Hi-Res frame in the source. */
function PlaceholderScreen({ section, query, onQuery }) {
  const title = UNDESIGNED[section] || section;
  return (
    <React.Fragment>
      <AdminHeader title={title} avatar="var(--dale-gray-medium)" query={query} onQuery={onQuery} />
      <DashboardBody>
        <ContentCard>
          <div style={{
            flexGrow: 1, alignSelf: 'stretch', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center',
          }}>
            <img src={chevronsRed} width="60" style={{ opacity: 0.25 }} />
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{title}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)', maxWidth: 380, lineHeight: 1.6 }}>
              This section exists in the Dale sidebar but has no designed screen in
              Dale-Admin Mockup.fig. Left intentionally blank rather than invented.
            </div>
          </div>
        </ContentCard>
      </DashboardBody>
    </React.Fragment>
  );
}

export { PlaceholderScreen };
