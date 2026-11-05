import React from 'react';
import { Button, Dropdown, InputBoxWithUnit, Switch, Tables } from '@dale/ui';
import { AdminHeader, ContentCard, DashboardBody } from './AdminChrome.jsx';

/* Pricing — Hi-Res "Pricing > Platform" (141:20476) and "Pricing > Platform Detail" (146:20879).
   The frames still carry placeholder tabs (Home / Edit Profile) and "Label" buttons with the M3
   star; the kit drops the tabs (Pricing has one view) and names the buttons for what they do. */

const PRICING_ROWS = [
  { id: 'do', enabled: true, country: 'Dominican Republic', mode: 'Absorb Costs', pct: '2', amount: '0', maint: '100', cur: 'DOP', updated: '2 hours ago' },
  { id: 'sv', enabled: false, country: 'El Salvador', mode: 'Sum Costs', pct: '1.5', amount: '0', maint: '10', cur: 'USD', updated: '3 days ago' },
];
const pr = (w, s, c) => ({ fontFamily: 'var(--font-ui)', fontWeight: w, fontSize: s, lineHeight: '100%', color: c, whiteSpace: 'nowrap' });

function PricingHead({ title, sub, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, alignSelf: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={pr(700, 24, 'var(--ui-ink-900)')}>{title}</span>
        {sub && <span style={pr(400, 14, 'var(--ui-ink-500)')}>{sub}</span>}
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{children}</div>
    </div>
  );
}

function PricingList({ rows, onToggle, onOpen }) {
  return (
    <React.Fragment>
      <PricingHead title="Country Pricing" sub="Manage your platform pricing." />
      <Tables
        style={{ alignSelf: 'stretch' }}
        selectable={false}
        columns={[
          { key: 'sw', label: 'Enable/Disabled', sortable: false },
          { key: 'country', label: 'Country', bold: true },
          { key: 'mode', label: 'Fee Mode' },
          { key: 'pct', label: 'Fee Cash-Out' },
          { key: 'maint', label: 'Fee Maintenance' },
        ]}
        rows={rows.map((r) => ({
          sw: <Switch checked={r.enabled} onChange={() => onToggle(r.id)} />,
          country: r.country, mode: r.mode, pct: r.pct + '%', maint: `${r.cur} ${r.maint}`,
        }))}
        rowActions={(row, i) => onOpen(rows[i].id)}
        resultCount={rows.length}
        page={1} pageCount={1}
      />
    </React.Fragment>
  );
}

function PricingDetail({ row, onCancel, onSave }) {
  const [d, setD] = React.useState(row);
  const set = (k) => (v) => setD((s) => ({ ...s, [k]: v }));
  const num = (k) => (e) => set(k)(e.target.value.replace(/[^0-9.]/g, ''));
  const col = { display: 'flex', flexDirection: 'column', gap: 24, flex: '1 1 0', minWidth: 0 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
      <div style={{ padding: '32px 48px', border: '1px solid var(--ui-line-200)', boxSizing: 'border-box' }}>
        <PricingHead title="Edit Platform Pricing">
          <Button variant="secondary" icon={null} onClick={onCancel}>Cancel</Button>
          <Button variant="continue" onClick={() => onSave(d)}>Save Changes</Button>
        </PricingHead>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '40px 48px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={col}><Dropdown label="Country" options={PRICING_ROWS.map((r) => r.country)} value={d.country} onChange={set('country')} /></div>
          <div style={col}><Dropdown label="Fee Mode" options={['Absorb Costs', 'Sum Costs']} value={d.mode} onChange={set('mode')} /></div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={col}><InputBoxWithUnit label="Fee % Cash-Out" unit="%" fieldWidth={166} value={d.pct} onChange={num('pct')} /></div>
          <div style={col}>
            <InputBoxWithUnit label="Fee amount Cash-Out" unit={d.cur} fieldWidth={231} value={d.amount} onChange={num('amount')} />
            <InputBoxWithUnit label="Customer Fee Maintenance" unit={d.cur} fieldWidth={235} value={d.maint} onChange={num('maint')} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={pr(500, 14, 'var(--ui-ink-700)')}>Status</span>
          <Switch checked={d.enabled} onChange={(e) => set('enabled')(e.target.checked)} label={d.enabled ? 'Enabled' : 'Disabled'} />
        </div>
      </div>
      <div style={{ padding: '32px 48px', background: 'var(--ui-fill-25)', border: '1px solid var(--ui-line-200)', boxSizing: 'border-box' }}>
        <span style={pr(400, 14, 'var(--ui-ink-500)')}>Last updated {row.updated}</span>
      </div>
    </div>
  );
}

function PricingScreen({ query, onQuery }) {
  const [rows, setRows] = React.useState(PRICING_ROWS);
  const [openId, setOpenId] = React.useState(null);
  const open = rows.find((r) => r.id === openId);
  return (
    <React.Fragment>
      <AdminHeader title="Pricing" avatar="var(--dale-gray-medium)" query={query} onQuery={onQuery} />
      <DashboardBody>
        <ContentCard style={{ padding: '37px 32px', gap: 24 }}>
          {open
            ? <PricingDetail key={open.id} row={open} onCancel={() => setOpenId(null)} onSave={(d) => { setRows((rs) => rs.map((r) => (r.id === d.id ? { ...d, updated: 'just now' } : r))); setOpenId(null); }} />
            : <PricingList rows={rows} onOpen={setOpenId} onToggle={(id) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))} />}
        </ContentCard>
      </DashboardBody>
    </React.Fragment>
  );
}

export { PricingScreen };
