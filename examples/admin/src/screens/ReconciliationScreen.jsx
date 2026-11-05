import React from 'react';
import { Button, Icon, NavigationBar, Tables } from '@dale/ui';
import { MonitoringData } from '../data/index.js';
import { AdminHeader, ContentCard, DashboardBody } from './AdminChrome.jsx';
import { LinkText, StatusPill, fmtDate, fmtMoney, monFont } from './MonitoringParts.jsx';
import { TransactionDrawer } from './TransactionDrawer.jsx';
import { Money, Toast } from './CustomersParts.jsx';
import { TypeCell } from './OperationsScreen.jsx';
import { ClosePeriodDialog, PeriodChip, PeriodPicker, Statement, ageOf, exceptionsOf, inPeriod, isCurrent, periodLabel, rcMiniBtn, summarize } from './ReconciliationParts.jsx';

/* Reconciliation — Cash-In and Cash-Out only (P2P and Balance Convert are internal to the platform).
   Periods (month × aggregator, Open | Closed) and the three reports:
   Summary (formal statement), Transactions (batch), Exceptions (what blocks close).
   A closed period is rendered from its frozen snapshot; it never reopens. */

function PeriodsTab({ periods, txs, onView, onClose, onDownload }) {
  const D = MonitoringData;
  const columns = [
    { key: 'period', label: 'Period', sortable: false }, { key: 'agg', label: 'Aggregator', sortable: false },
    { key: 'status', label: 'Status', sortable: false }, { key: 'owed', label: 'Aggregator fee', sortable: false },
    { key: 'count', label: 'Transactions', sortable: false }, { key: 'exc', label: 'Open exceptions', sortable: false },
    { key: 'closed', label: 'Closed at / by', sortable: false }, { key: 'act', label: 'Actions', sortable: false },
  ];
  const rows = periods.map((p) => {
    const closed = p.status === 'Closed';
    const s = closed ? p.snapshot : summarize(txs.filter((t) => inPeriod(t, p)));
    const exc = closed ? 0 : exceptionsOf(txs, p, D).length;
    const current = isCurrent(p, D.NOW);
    const blocked = !closed && (current || exc > 0);
    return {
      period: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><LinkText onClick={() => onView(p.id)}>{periodLabel(p)}</LinkText>{current && <span style={monFont(400, 12, '100%', 'var(--dale-gray-medium)')}>in progress</span>}</span>,
      agg: p.aggregator,
      status: <PeriodChip p={p} />,
      owed: <Money v={s.total.aggregator_fee} />,
      count: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.refs.length.toLocaleString('en-US')}</span>,
      exc: closed ? <span style={{ color: 'var(--dale-gray-light)' }}>—</span>
        : <span style={{ ...monFont(exc ? 700 : 400, 14, '20px', exc ? 'var(--dale-accent)' : 'var(--dale-black)'), fontVariantNumeric: 'tabular-nums' }}>{exc}</span>,
      closed: closed ? <span style={{ whiteSpace: 'nowrap' }}>{fmtDate(p.closed_at)} <span style={{ color: 'var(--dale-gray-medium)' }}>· {p.closed_by}</span></span> : <span style={{ color: 'var(--dale-gray-light)' }}>—</span>,
      act: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <button type="button" style={rcMiniBtn(false)} onClick={() => onView(p.id)}>View summary</button>
          {!closed && (
            <button type="button" disabled={blocked} style={rcMiniBtn(blocked)} onClick={() => onClose(p.id)}
              title={current ? 'The month is still in progress' : exc ? `${exc} exceptions pending` : 'Close this period'}>
              {current ? 'Closes after month end' : exc ? `Close · ${exc} exceptions pending` : 'Close period'}
            </button>
          )}
          <button type="button" title="Download PDF" style={rcMiniBtn(false)} onClick={() => onDownload(p, 'PDF')}><Icon name="TableDownload" size={14} />PDF</button>
          <button type="button" title="Download CSV" style={rcMiniBtn(false)} onClick={() => onDownload(p, 'CSV')}><Icon name="TableDownload" size={14} />CSV</button>
        </span>
      ),
    };
  });
  return (
    <div style={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
      <Tables fillHeight dense columns={columns} rows={rows} selectable={false} rowActions={false} resultCount={periods.length} />
    </div>
  );
}

function PeriodToolbar({ periods, p, onPick, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', alignSelf: 'stretch', flexShrink: 0 }}>
      <PeriodPicker periods={periods} value={p.id} onChange={onPick} />
      <div style={{ height: 40, display: 'flex', alignItems: 'center' }}><PeriodChip p={p} /></div>
      <span style={{ flexGrow: 1 }} />
      {children}
    </div>
  );
}

function RcTxTable({ list, D, onOpen, withAge, exportLabel, onExport }) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  React.useEffect(() => setPage(1), [list.length]);
  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
  const slice = list.slice((page - 1) * pageSize, page * pageSize);
  const cust = (id) => D.customers.find((c) => c.id === id);
  const biz = (id) => D.businesses.find((b) => b.id === id);
  const dash = <span style={{ color: 'var(--dale-gray-light)' }}>—</span>;
  const num = (v) => v == null ? dash : <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(v)}</span>;
  const columns = [
    { key: 'ref', label: 'Reference', sortable: false }, { key: 'type', label: 'Type', sortable: false }, { key: 'status', label: 'Status', sortable: false },
    ...(withAge ? [{ key: 'customer', label: 'Customer', sortable: false }, { key: 'phone', label: 'Phone', sortable: false }] : [{ key: 'business', label: 'Business', sortable: false }]),
    { key: 'amount', label: 'Amount', sortable: false },
    ...(withAge ? [] : [{ key: 'agg', label: 'Aggregator fee', sortable: false }]),
    { key: 'created', label: 'Created at', sortable: false },
    ...(withAge ? [{ key: 'age', label: 'Pending for', sortable: false }] : []),
  ];
  const rows = slice.map((t) => ({
    ref: <LinkText onClick={() => onOpen(t.id)}>{t.short_reference}</LinkText>, type: <TypeCell t={t} />, status: <StatusPill status={t.status} />,
    customer: cust(t.customer_id).name, phone: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{cust(t.customer_id).phone}</span>,
    business: t.business_id ? biz(t.business_id).name : dash,
    amount: <Money v={t.amount} />, agg: num(t.aggregator_fee),
    created: fmtDate(t.created_at), age: <span style={monFont(700, 14, '20px', 'var(--dale-accent)')}>{ageOf(t, D.NOW)}</span>,
  }));
  return (
    <div style={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
      <Tables fillHeight dense columns={columns} rows={rows} selectable={false} rowActions={(_, i) => onOpen(slice[i].id)}
        resultCount={list.length} onExport={list.length ? onExport : undefined}
        page={page} pageCount={pageCount} onPageChange={setPage}
        pageSize={pageSize} pageSizeOptions={[25, 50, 100, 250]} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
    </div>
  );
}

function ReconciliationScreen({ query, onQuery }) {
  const D = MonitoringData;
  const TABS = ['periods', 'summary', 'transactions', 'exceptions'];
  const parse = () => { const p = location.hash.slice(1).split('/'); return { tab: TABS.includes(p[1]) ? p[1] : 'periods', pid: p[2] || D.RECON.periods[1].id }; };
  const [route, setRoute] = React.useState(parse);
  React.useEffect(() => { history.replaceState(null, '', '#reconciliation/' + route.tab + (route.tab !== 'periods' ? '/' + route.pid : '')); }, [route]);
  const [txs, setTxs] = React.useState(D.transactions);
  const [periods, setPeriods] = React.useState(() => D.RECON.periods.map((p) => p.status === 'Closed' && !p.snapshot ? { ...p, snapshot: summarize(D.transactions.filter((t) => inPeriod(t, p))) } : p));
  const [closing, setClosing] = React.useState(null);
  const [openTx, setOpenTx] = React.useState(null);
  const [excView, setExcView] = React.useState('blocking');
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2800); return () => clearTimeout(t); }, [toast]);

  const p = periods.find((x) => x.id === route.pid) || periods[0];
  const closed = p.status === 'Closed';
  const live = txs.filter((t) => inPeriod(t, p));
  const s = closed ? p.snapshot : summarize(live);
  const batch = closed ? p.snapshot.refs.map((id) => txs.find((t) => t.id === id)).filter(Boolean) : live;
  const blocking = closed ? [] : exceptionsOf(txs, p, D);
  const informational = live.filter((t) => t.status === 'Failed' || t.status === 'Cancelled');
  const current = isCurrent(p, D.NOW);
  const canClose = !closed && !current && blocking.length === 0;
  const go = (tab, pid) => setRoute({ tab, pid: pid || route.pid });
  const download = (per, fmt) => setToast(`Downloading ${periodLabel(per)} statement · ${fmt}${per.status === 'Closed' ? ' · from snapshot' : ' · live, not final'}`);
  const confirmClose = () => {
    const per = periods.find((x) => x.id === closing);
    const snap = summarize(txs.filter((t) => inPeriod(t, per)));
    setPeriods((all) => all.map((x) => x.id === closing ? { ...x, status: 'Closed', closed_at: new Date(D.NOW), closed_by: 'Miguel Toirac', snapshot: snap } : x));
    setClosing(null); setToast(`${periodLabel(per)} closed · snapshot of ${snap.refs.length} references frozen`);
  };
  const closeBtn = !closed && (
    <Button variant="continue" icon={null} disabled={!canClose} onClick={() => setClosing(p.id)}>
      {current ? 'Closes after month end' : blocking.length ? `${blocking.length} exceptions pending` : 'Close period'}
    </Button>
  );
  const dlBtns = (
    <React.Fragment>
      <Button variant="standard" icon={<Icon name="TableDownload" size={20} />} onClick={() => download(p, 'PDF')}>PDF</Button>
      <Button variant="standard" icon={<Icon name="TableDownload" size={20} />} onClick={() => download(p, 'CSV')}>CSV</Button>
    </React.Fragment>
  );
  const pillBtn = (on) => ({ height: 32, padding: '0 14px', borderRadius: 100, border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, background: on ? 'var(--dale-dark)' : 'var(--dale-silver)', ...monFont(500, 13, '100%', on ? 'var(--dale-white)' : 'var(--dale-gray-hard)') });

  return (
    <React.Fragment>
      <AdminHeader title="Reconciliation" avatar="var(--dale-gray-medium)" query={query} onQuery={onQuery}
        tabs={<NavigationBar tabs={['Periods', 'Summary', 'Transactions', 'Exceptions']} active={TABS.indexOf(route.tab)} onChange={(i) => go(TABS[i])} style={{ alignSelf: 'center', width: 520, marginTop: 6 }} />} />
      <DashboardBody style={{ minHeight: 0, overflow: 'hidden', padding: 20, gap: 20 }}>
        <ContentCard style={{ minHeight: 0, padding: '20px 20px 16px', borderRadius: 16, gap: 16 }}>
          {route.tab === 'periods' && <PeriodsTab periods={periods} txs={txs} onView={(id) => go('summary', id)} onClose={setClosing} onDownload={download} />}

          {route.tab === 'summary' && (
            <React.Fragment>
              <PeriodToolbar periods={periods} p={p} onPick={(id) => go('summary', id)}>{dlBtns}{closeBtn}</PeriodToolbar>
              <div style={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', alignSelf: 'stretch', padding: '4px 0 8px' }}>
                <Statement p={p} s={s} exceptions={blocking.length} />
              </div>
            </React.Fragment>
          )}

          {route.tab === 'transactions' && (
            <React.Fragment>
              <PeriodToolbar periods={periods} p={p} onPick={(id) => go('transactions', id)}>
                <span style={monFont(400, 13, '18px', 'var(--dale-gray-medium)')}>{closed ? `Frozen batch · ${batch.length} references at close` : 'Live — changes until the period is closed'} · Cash-In and Cash-Out only</span>
              </PeriodToolbar>
              <RcTxTable key={p.id} list={batch} D={D} onOpen={setOpenTx} onExport={() => setToast(`Exporting ${batch.length} transactions · CSV`)} />
            </React.Fragment>
          )}

          {route.tab === 'exceptions' && (
            <React.Fragment>
              <PeriodToolbar periods={periods} p={p} onPick={(id) => go('exceptions', id)}>
                <span style={monFont(400, 13, '18px', 'var(--dale-gray-medium)')}>Pending older than <b style={{ fontWeight: 600, color: 'var(--dale-black)' }}>{D.RECON.threshold_h} h</b> blocks close · Cash-In auto-cancels after {D.RECON.cashin_autocancel_h} h · set in System Parameters</span>
              </PeriodToolbar>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button type="button" style={pillBtn(excView === 'blocking')} onClick={() => setExcView('blocking')}>Blocking <b style={{ fontWeight: 700 }}>{blocking.length}</b></button>
                <button type="button" style={pillBtn(excView === 'info')} onClick={() => setExcView('info')}>Informational · failed & cancelled <b style={{ fontWeight: 700 }}>{informational.length}</b></button>
              </div>
              {excView === 'blocking' && blocking.length === 0
                ? (
                  <div style={{ alignSelf: 'stretch', border: '1px solid var(--dale-border-cool)', borderRadius: 8, padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
                    <span style={monFont(600, 16, '24px', 'var(--dale-black)')}>{closed ? 'This period is closed' : 'Nothing blocks this period'}</span>
                    <span style={{ ...monFont(400, 14, '20px', 'var(--dale-gray-medium)'), maxWidth: 440 }}>
                      {closed ? `Closed ${fmtDate(p.closed_at)} by ${p.closed_by}. Late adjustments land in the open period.` : current ? 'No pending past the threshold. The period can be closed after the month ends.' : 'No pending past the threshold. Review the summary and close the period.'}
                    </span>
                    {canClose && <Button variant="continue" icon={null} onClick={() => setClosing(p.id)} style={{ marginTop: 8 }}>Close period</Button>}
                  </div>
                )
                : <RcTxTable key={p.id + excView} list={excView === 'blocking' ? blocking : informational} D={D} onOpen={setOpenTx} withAge={excView === 'blocking'} onExport={() => setToast('Exporting exceptions · CSV')} />}
            </React.Fragment>
          )}
        </ContentCard>
      </DashboardBody>

      {closing && <ClosePeriodDialog p={periods.find((x) => x.id === closing)} s={summarize(txs.filter((t) => inPeriod(t, periods.find((x) => x.id === closing))))} onClose={() => setClosing(null)} onConfirm={confirmClose} />}
      <TransactionDrawer tx={txs.find((t) => t.id === openTx)} data={D} onClose={() => setOpenTx(null)}
        onCancelled={(id, reason) => setTxs((all) => all.map((t) => t.id === id ? { ...t, status: 'Cancelled', cancelled: { reason }, pin: { ...t.pin, status: 'Void' } } : t))} />
      {toast && <Toast>{toast}</Toast>}
    </React.Fragment>
  );
}

export { ReconciliationScreen };
