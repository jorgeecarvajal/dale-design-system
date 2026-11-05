import React from 'react';
import { MonitoringData } from '../data/index.js';
import { AdminHeader } from './AdminChrome.jsx';
import { fmtMoney, toLocalInput } from './MonitoringParts.jsx';

/* Dashboard — Hi-Res "Dashboard" frame (9:299, RevG). Values transcribed from the frame.
   Success rate = completed ÷ (completed + failed); pending and cancelled excluded. */

const RANGES = [{ k: 'today', label: 'Today' }, { k: '7d', label: '7 days' }, { k: '30d', label: '30 days' }, { k: 'custom', label: 'Custom' }];
const dsh = (w, s, c) => ({ fontFamily: 'var(--font-ui)', fontWeight: w, fontSize: s, lineHeight: '100%', color: c, whiteSpace: 'nowrap' });
const fmtInt = (n) => Number(n).toLocaleString('en-US');
const pct = (a, b) => (b ? (a / b) * 100 : 0);
const fmtPct = (v) => v.toFixed(1) + '%';
const card = { background: 'var(--surface-card)', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--ui-line-150)', boxSizing: 'border-box', minWidth: 0 };

function rangeBounds(k, custom, NOW) {
  const day = 24 * 3600e3;
  if (k === 'today') { const s = new Date(NOW); s.setHours(0, 0, 0, 0); return [s, NOW]; }
  if (k === '30d') return [new Date(NOW - 30 * day), NOW];
  if (k === 'custom') return [custom.from ? new Date(custom.from) : null, custom.to ? new Date(custom.to) : null];
  return [new Date(NOW - 7 * day), NOW];
}

function CardHead({ label, onOpen }) {
  return (
    <div style={{ height: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
      <span style={dsh(600, 13, 'var(--ui-text-900)')}>{label}</span>
      {onOpen && <button type="button" onClick={onOpen} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', ...dsh(400, 13, 'var(--ui-link)') }}>View</button>}
    </div>
  );
}

function Amount({ value, unit, size = 28 }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', fontVariantNumeric: 'tabular-nums' }}>
      <span style={dsh(700, size, 'var(--ui-text-900)')}>{value}</span>
      {unit && <span style={dsh(400, 13, 'var(--ui-text-500)')}>{unit}</span>}
    </div>
  );
}
const Sub = ({ children }) => <span style={{ ...dsh(400, 12, 'var(--ui-text-500)'), fontVariantNumeric: 'tabular-nums' }}>{children}</span>;

function KpiCard({ label, onOpen, children }) {
  return <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 8, padding: 20 }}><CardHead label={label} onOpen={onOpen} />{children}</div>;
}

function Bar({ parts, total }) {
  return (
    <div style={{ height: 8, overflow: 'hidden', borderRadius: 4, display: 'flex', alignSelf: 'stretch', background: 'var(--ui-fill-100)' }}>
      {parts.map((p) => p.v > 0 && <div key={p.label} style={{ width: pct(p.v, total) + '%', background: p.color }} />)}
    </div>
  );
}
function Legend({ parts }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', alignSelf: 'stretch' }}>
      {parts.map((p) => (
        <div key={p.label} style={{ display: 'flex', gap: 6, alignItems: 'center', height: 15 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span style={dsh(400, 12, 'var(--ui-text-500)')}>{p.label}</span>
          <span style={{ ...dsh(600, 12, 'var(--ui-text-900)'), fontVariantNumeric: 'tabular-nums' }}>{fmtInt(p.v)}</span>
        </div>
      ))}
    </div>
  );
}
function StatusCard({ label, parts, total }) {
  return (
    <div style={{ ...card, minHeight: 188, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: '50px 20px' }}>
      <span style={dsh(600, 13, 'var(--ui-text-900)')}>{label}</span>
      <Bar parts={parts} total={total} />
      <Legend parts={parts} />
    </div>
  );
}

function RangeTabs({ range, setRange }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {RANGES.map((r) => {
        const on = range === r.k;
        return (
          <button key={r.k} role="tab" aria-selected={on} type="button" onClick={() => setRange(r.k)} style={{
            height: 28, padding: '6px 14px', borderRadius: 20, border: 0, cursor: 'pointer', boxSizing: 'border-box',
            background: on ? 'var(--ui-text-900)' : 'var(--surface-card)', boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--dale-field-border)',
            ...dsh(on ? 600 : 400, 13, on ? 'var(--dale-white)' : 'var(--ui-text-900)'),
          }}>{r.label}</button>
        );
      })}
    </div>
  );
}

function DashboardScreen({ query, onQuery, onNavigate }) {
  const D = MonitoringData;
  const [range, setRange] = React.useState('7d');
  const [custom, setCustom] = React.useState({ from: toLocalInput(new Date(D.NOW - 3 * 24 * 3600e3)), to: toLocalInput(D.NOW) });
  const bounds = rangeBounds(range, custom, D.NOW);
  const inRange = (d) => (!bounds[0] || d >= bounds[0]) && (!bounds[1] || d <= bounds[1]);
  const txs = D.transactions.filter((t) => inRange(t.created_at));
  const sum = (list) => list.reduce((s, t) => s + t.amount, 0);
  const cin = txs.filter((t) => t.type === 'Cash-In'), cout = txs.filter((t) => t.type === 'Cash-Out');
  const by = (s) => txs.filter((t) => t.status === s).length;
  const done = by('Completed'), failed = by('Failed'), cancelled = by('Cancelled'), pending = by('Pending');
  const pinsIn = (D.pins || []).filter((p) => inRange(p.created_at));
  const pinBy = (s) => pinsIn.filter((p) => p.status === s).length;
  const custs = D.customers;
  const custBy = (s) => custs.filter((c) => (c.status || 'Active') === s).length;
  const countries = [...new Set(custs.map((c) => c.country || 'Dominican Republic'))];
  const activeIds = new Set(txs.map((t) => t.customer_id));
  const avg = activeIds.size ? sum(txs) / activeIds.size : 0;
  const go = () => onNavigate && onNavigate('operations');
  const goCustomers = () => { history.replaceState(null, '', '#operations/customers'); go(); };
  const f = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '…';
  const dt = { height: 28, boxSizing: 'border-box', border: 0, boxShadow: 'inset 0 0 0 1px var(--dale-field-border)', borderRadius: 8, padding: '0 10px', background: 'var(--surface-card)', ...dsh(400, 13, 'var(--ui-text-900)') };

  const txParts = [
    { label: 'Completed', v: done, color: 'var(--status-success)' },
    { label: 'Pending', v: pending, color: 'var(--status-warning)' },
    { label: 'Failed', v: failed, color: 'var(--status-danger)' },
    { label: 'Cancelled', v: cancelled, color: 'var(--status-neutral)' },
  ];
  const pinParts = [
    { label: 'Active', v: pinBy('Active'), color: 'var(--dale-yellow)' },
    { label: 'Expired', v: pinBy('Expired'), color: 'var(--status-danger)' },
    { label: 'Redeemed', v: pinBy('Redeemed'), color: 'var(--status-success)' },
    { label: 'Merged', v: pinBy('Merged'), color: 'var(--status-neutral)' },
  ];
  const custParts = [
    { label: 'Active', v: custBy('Active'), color: 'var(--status-success)' },
    { label: 'Suspended', v: custBy('Suspended'), color: 'var(--status-warning)' },
    { label: 'Cancelled', v: custBy('Cancelled'), color: 'var(--status-danger)' },
  ];

  return (
    <React.Fragment>
      <AdminHeader title="Dashboard" avatar="var(--dale-black-pure)" query={query} onQuery={onQuery} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 32, boxSizing: 'border-box', alignSelf: 'stretch', flexGrow: 1 }}>
        <div style={{ minHeight: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', alignSelf: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <RangeTabs range={range} setRange={setRange} />
            {range === 'custom' && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="datetime-local" value={custom.from} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} style={dt} aria-label="From" />
              <span style={dsh(400, 13, 'var(--ui-text-500)')}>to</span>
              <input type="datetime-local" value={custom.to} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} style={dt} aria-label="To" />
            </div>}
          </div>
          <span style={dsh(400, 13, 'var(--ui-text-500)')}>{f(bounds[0])} - {f(bounds[1])} · DOP</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gridAutoRows: 'minmax(150px, auto)', gap: 16, alignSelf: 'stretch' }}>
          <KpiCard label="Cash-In" onOpen={go}><Amount value={fmtMoney(sum(cin))} unit="DOP" /><Sub>{fmtInt(cin.length)} transactions</Sub></KpiCard>
          <KpiCard label="Cash-Out" onOpen={go}><Amount value={fmtMoney(sum(cout))} unit="DOP" /><Sub>{fmtInt(cout.length)} transactions</Sub></KpiCard>
          <KpiCard label="Success rate"><Amount value={fmtPct(pct(done, done + failed))} /><Sub>{fmtInt(done)} completed · {fmtInt(failed)} failed</Sub></KpiCard>
          <KpiCard label="Cancelled"><Amount value={fmtPct(pct(cancelled, txs.length))} /><Sub>{fmtInt(cancelled)} of {fmtInt(txs.length)} · basic risk signal</Sub></KpiCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16, alignSelf: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <StatusCard label="Transactions by status" parts={txParts} total={txs.length} />
            <StatusCard label="PINs by status" parts={pinParts} total={pinsIn.length} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 16, padding: '24px 20px' }}>
              <CardHead label="Customers" onOpen={goCustomers} />
              <span style={{ ...dsh(700, 36, 'var(--ui-text-900)'), fontVariantNumeric: 'tabular-nums' }}>{fmtInt(custs.length)}</span>
              <Sub>{countries.length === 1 ? `All in ${countries[0]}` : `${countries.length} countries`}</Sub>
              <Bar parts={custParts} total={custs.length} />
              <Legend parts={custParts} />
            </div>
            <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 20px' }}>
              <CardHead label="Avg. volume per active customer" />
              <Amount value={fmtMoney(avg)} unit="DOP" size={26} />
              <Sub>{fmtInt(activeIds.size)} active customers · {fmtMoney(sum(txs))} DOP total</Sub>
              <div style={{ minHeight: 46, borderRadius: 8, background: 'var(--dale-silver)', padding: '10px 12px', boxSizing: 'border-box', alignSelf: 'stretch', fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: '16px', color: 'var(--ui-text-500)' }}>
                Proxy: one overall average — it doesn't show whether usage is even or concentrated in a few customers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { DashboardScreen };
