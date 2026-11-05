import React from 'react';
import { Button, Chips, DaleLogo, Dialog } from '@dale/ui';
import { MonitoringData } from '../data/index.js';
import { FilterSelect, fmtDate, fmtMoney, monFont } from './MonitoringParts.jsx';
import { Overlay } from './CustomersParts.jsx';

/* Shared bits for Reconciliation: period maths, summary (type × fee layer), statement, close dialog. */
/* Only Cash-In and Cash-Out touch the aggregator. P2P and Balance Convert (in/out) are internal to the platform. */
const RC_TYPES = ['Cash-In', 'Cash-Out'];
/* Aggregator-facing: amount + aggregator fee only. Platform fee, payout and owed are internal to Dale
   (owed = aggregator fee while business fee is 0), so they never appear here. */
const RC_FIELDS = [['amount', 'Amount'], ['aggregator_fee', 'Aggregator fee']];

const periodLabel = (p) => new Date(p.y, p.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const periodRange = (p) => { const last = new Date(p.y, p.m + 1, 0).getDate(); const mo = new Date(p.y, p.m, 1).toLocaleDateString('en-US', { month: 'short' }); return `${mo} 1 – ${mo} ${last}, ${p.y}`; };
const inPeriod = (t, p) => RC_TYPES.includes(t.type) && t.created_at.getFullYear() === p.y && t.created_at.getMonth() === p.m;
const isCurrent = (p, now) => now.getFullYear() === p.y && now.getMonth() === p.m;
const exceptionsOf = (txs, p, D) => txs.filter((t) => inPeriod(t, p) && t.status === 'Pending' && D.NOW - t.created_at > D.RECON.threshold_h * 3600e3);
const ageOf = (t, now) => { const h = Math.floor((now - t.created_at) / 3600e3); return h >= 48 ? `${Math.floor(h / 24)} d` : `${h} h`; };

/** Totals of Completed rows per operation type × fee layer, plus informational counts. */
function summarize(txs) {
  const D = MonitoringData;
  const sum = (list) => Object.fromEntries(RC_FIELDS.map(([k]) => [k, +list.reduce((s, t) => s + (t[k] || 0), 0).toFixed(2)]));
  const done = txs.filter((t) => t.status === 'Completed');
  return {
    rows: RC_TYPES.map((type) => { const l = done.filter((t) => t.type === type); return { type, count: l.length, ...sum(l) }; }),
    total: { count: done.length, ...sum(done) },
    info: { failed: txs.filter((t) => t.status === 'Failed').length, cancelled: txs.filter((t) => t.status === 'Cancelled').length, pending: txs.filter((t) => t.status === 'Pending').length },
    refs: txs.map((t) => t.id),
  };
}

function PeriodChip({ p }) {
  return <Chips status={p.status === 'Open' ? 'Pending' : 'Completed'} label={p.status} size="small" />;
}

function PeriodPicker({ periods, value, onChange }) {
  const labels = periods.map((p) => `${periodLabel(p)} · ${p.aggregator}`);
  return (
    <div style={{ width: 280 }}>
      <FilterSelect label="Period" options={labels} value={labels[periods.findIndex((p) => p.id === value)]} onChange={(l) => onChange(periods[labels.indexOf(l)].id)} />
    </div>
  );
}

const rcMiniBtn = (disabled) => ({ height: 28, padding: '0 12px', borderRadius: 100, border: 0, cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', background: disabled ? 'var(--background-disabled-default)' : 'var(--dale-silver)', ...monFont(500, 13, '100%', disabled ? 'var(--text-disabled-default)' : 'var(--dale-gray-hard)') });

function StatementTable({ s, compact }) {
  const cols = [[ 'count', compact ? 'Tx' : 'Transactions'], ...RC_FIELDS];
  const th = { ...monFont(600, 11, '100%', 'var(--dale-gray-medium)'), letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right', padding: '0 0 10px 16px', whiteSpace: 'nowrap', borderBottom: '1px solid var(--dale-border-cool)' };
  const td = (strong) => ({ ...monFont(strong ? 700 : 400, compact ? 13 : 14, '20px', 'var(--dale-black)'), textAlign: 'right', padding: compact ? '7px 0 7px 16px' : '11px 0 11px 16px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' });
  const val = (r, k) => (k === 'count' ? r.count.toLocaleString('en-US') : fmtMoney(r[k]));
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr><th style={{ ...th, textAlign: 'left', paddingLeft: 0 }}>Operation</th>{cols.map(([k, l]) => <th key={k} style={th}>{l}</th>)}</tr></thead>
      <tbody>
        {s.rows.map((r) => (
          <tr key={r.type} style={{ borderBottom: '1px solid var(--dale-border-cool)' }}>
            <td style={{ ...td(false), textAlign: 'left', paddingLeft: 0 }}>{r.type}</td>{cols.map(([k]) => <td key={k} style={td(false)}>{val(r, k)}</td>)}
          </tr>
        ))}
        <tr style={{ background: 'var(--dale-silver)' }}>
          <td style={{ ...td(true), textAlign: 'left', paddingLeft: 12 }}>Total · DOP</td>{cols.map(([k]) => <td key={k} style={{ ...td(true), paddingRight: k === cols[cols.length - 1][0] ? 12 : 0 }}>{val(s.total, k)}</td>)}
        </tr>
      </tbody>
    </table>
  );
}

/** Formal statement, sendable to the aggregator. Closed = rendered from the frozen snapshot. */
function Statement({ p, s, exceptions }) {
  const closed = p.status === 'Closed';
  const meta = (k, v) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ ...monFont(600, 11, '100%', 'var(--dale-gray-medium)'), letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</span>
      <span style={monFont(500, 14, '20px', 'var(--dale-black)')}>{v}</span>
    </div>
  );
  return (
    <article style={{ width: '100%', maxWidth: 1040, margin: '0 auto', background: 'var(--dale-white)', border: '1px solid var(--dale-border-cool)', borderRadius: 12, padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 28, boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={monFont(800, 26, '100%', 'var(--dale-black)')}>Reconciliation statement</span>
          <span style={monFont(400, 14, '20px', 'var(--dale-gray-medium)')}>Dale × {p.aggregator} · {periodRange(p)}</span>
        </div>
        <DaleLogo width={104} />
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20, padding: '18px 0', borderTop: '1px solid var(--dale-border-cool)', borderBottom: '1px solid var(--dale-border-cool)' }}>
        {meta('Period', periodLabel(p))}
        {meta('Aggregator', p.aggregator)}
        {meta('Status', <PeriodChip p={p} />)}
        {meta(closed ? 'Closed' : 'Source', closed ? `${fmtDate(p.closed_at)} · ${p.closed_by}` : 'Live ledger · not final')}
      </div>
      <StatementTable s={s} />
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220 }}>
          <span style={{ ...monFont(600, 11, '100%', 'var(--dale-gray-medium)'), letterSpacing: '0.06em', textTransform: 'uppercase' }}>Not included · informational</span>
          <span style={monFont(400, 14, '20px', 'var(--dale-black)')}>{s.info.failed} failed · {s.info.cancelled} cancelled</span>
        </div>
        {!closed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ ...monFont(600, 11, '100%', 'var(--dale-gray-medium)'), letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blocking close</span>
            <span style={monFont(400, 14, '20px', exceptions ? 'var(--dale-accent)' : 'var(--dale-black)')}>{exceptions ? `${exceptions} pending older than 72 h` : 'None'}</span>
          </div>
        )}
        <span style={{ flexGrow: 1 }} />
        <span style={{ ...monFont(400, 12, '18px', 'var(--dale-gray-medium)'), maxWidth: 380, textAlign: 'right' }}>
          Prepared from Dale's own ledger. Cash-In and Cash-Out only — P2P and Balance Convert are internal to the platform and not part of this statement. Totals include completed transactions only.{closed ? ' Frozen at close — regenerated from the snapshot, never from a live query.' : ''}
        </span>
      </div>
    </article>
  );
}

function ClosePeriodDialog({ p, s, onClose, onConfirm }) {
  return (
    <Overlay onClose={onClose}>
      <Dialog title={`Close ${periodLabel(p)} for ${p.aggregator}?`} align="start" style={{ width: 520 }}
        supportingText={`This freezes the totals below and the list of ${s.refs.length} references. A closed period never reopens — late adjustments land in the period open at that moment.`}
        actions={<React.Fragment><Button variant="standard" onClick={onClose}>Back</Button><Button variant="continue" icon={null} onClick={onConfirm}>Close period</Button></React.Fragment>}>
        <div style={{ background: 'var(--dale-white)', borderRadius: 12, padding: '14px 16px', alignSelf: 'stretch' }}>
          <StatementTable s={s} compact />
          <div style={{ ...monFont(400, 12, '18px', 'var(--dale-gray-hard)'), marginTop: 10 }}>Informational, not blocking: {s.info.failed} failed · {s.info.cancelled} cancelled</div>
        </div>
      </Dialog>
    </Overlay>
  );
}

export { RC_TYPES, periodLabel, periodRange, inPeriod, isCurrent, exceptionsOf, ageOf, summarize, PeriodChip, PeriodPicker, rcMiniBtn, StatementTable, Statement, ClosePeriodDialog };
