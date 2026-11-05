import React from 'react';
import { Button, Icon, NavigationBar, Tables } from '@dale/ui';
import { MonitoringData } from '../data/index.js';
import { AdminHeader, ContentCard, DashboardBody } from './AdminChrome.jsx';
import { CustomerSearch, FilterSelect, FilterText, LinkText, Skeleton, StatusPill, fmtDate, fmtMoney, monFont, toLocalInput } from './MonitoringParts.jsx';
import { TransactionDrawer } from './TransactionDrawer.jsx';
import { CustomersSection } from './CustomersScreen.jsx';

/* Operations — Transactions (unified GET /admin/pin-transactions ledger) and Customers.
   MonitoringTab also powers a customer's Activity tab: pass customerId to pre-filter. */

function TypeCell({ t }) {
  if (!t.direction) return t.type;
  const tag = { ...monFont(700, 10, '100%', 'var(--dale-gray-hard)'), letterSpacing: '0.06em', padding: '3px 6px', borderRadius: 4, background: 'var(--dale-sensitive)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>{t.type}
      <span style={tag} title={t.direction === 'in' ? 'PIN → Unassigned Balance' : 'Balance → new PIN'}>{t.direction === 'in' ? 'IN' : 'OUT'}</span>
      {t.initiated_by === 'system' && <span style={monFont(400, 12, '100%', 'var(--dale-gray-medium)')}>expiry</span>}
    </span>
  );
}

function MonitoringTab({ customerId }) {
  const scoped = !!customerId;
  const resetStyle = 'icon';
  const D = MonitoringData;
  const [txs, setTxs] = React.useState(D.transactions);
  const def = { ref: '', pin: '', customer: customerId || null, business: 'All businesses', type: 'All types', status: 'All statuses', from: scoped ? '' : toLocalInput(new Date(D.NOW.getTime() - 24 * 3600e3)), to: scoped ? '' : toLocalInput(D.NOW) };
  const [f, setF] = React.useState(def);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [loading, setLoading] = React.useState(true);
  const [openId, setOpenId] = React.useState(null);
  const [exporting, setExporting] = React.useState(null);
  const [showFilters, setShowFilters] = React.useState(true);
  React.useEffect(() => { if (exporting == null) return; const t = setTimeout(() => setExporting(null), 2600); return () => clearTimeout(t); }, [exporting]);
  const reset = () => { setF(def); setPage(1); };
  const resetLink = { border: 0, background: 'none', padding: 0, cursor: 'pointer', ...monFont(500, 12, '100%', 'var(--dale-gray-hard)'), textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' };
  const set = (k) => (v) => { setF((s) => ({ ...s, [k]: v })); setPage(1); };
  const key = JSON.stringify(f);
  React.useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 480); return () => clearTimeout(t); }, [key]);

  const bizOpts = ['All businesses', ...D.businesses.map((b) => b.name)];
  const noRange = !scoped && !f.from && !f.to;
  const rows = txs.filter((t) => {
    if (f.ref && !t.short_reference.startsWith(f.ref)) return false;
    if (f.pin && t.pin_full.toUpperCase() !== f.pin.toUpperCase()) return false;
    if (f.customer && t.customer_id !== f.customer) return false;
    if (f.business !== 'All businesses') { const b = D.businesses.find((x) => x.name === f.business); if (t.business_id !== b.id) return false; }
    if (f.type !== 'All types' && t.type !== f.type) return false;
    if (f.status !== 'All statuses' && t.status !== f.status) return false;
    if (f.from && t.created_at < new Date(f.from)) return false;
    if (f.to && t.created_at > new Date(f.to)) return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const slice = rows.slice((page - 1) * pageSize, page * pageSize);
  const cust = (id) => D.customers.find((c) => c.id === id);
  const biz = (id) => D.businesses.find((b) => b.id === id);

  const columns = [
    { key: 'ref', label: 'Reference', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    ...(scoped ? [] : [{ key: 'customer', label: 'Customer', sortable: false }, { key: 'phone', label: 'Phone', sortable: false }]),
    { key: 'business', label: 'Business', sortable: false },
    { key: 'amount', label: 'Amount', sortable: false },
    { key: 'created', label: 'Created at', sortable: false },
  ];
  const tableRows = loading
    ? Array.from({ length: 8 }, () => Object.fromEntries(columns.map((c) => [c.key, <Skeleton w={c.key === 'business' ? 120 : 80} />])))
    : slice.map((t) => ({
      ref: <LinkText onClick={() => setOpenId(t.id)}>{t.short_reference}</LinkText>,
      type: <TypeCell t={t} />,
      status: <StatusPill status={t.status} />,
      customer: cust(t.customer_id).name,
      phone: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{cust(t.customer_id).phone}</span>,
      business: t.business_id ? biz(t.business_id).name : <span style={{ color: 'var(--dale-gray-light)' }}>—</span>,
      amount: <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--dale-black)' }}>{fmtMoney(t.amount)} <span style={{ color: 'var(--dale-gray-medium)' }}>DOP</span></span>,
      created: fmtDate(t.created_at),
    }));
  const open = txs.find((t) => t.id === openId);
  const empty = !loading && rows.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 0, alignSelf: 'stretch', minWidth: 0, flexGrow: 1, minHeight: 0 }}>
      {showFilters && scoped && <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 200px) minmax(0, 200px) minmax(0, 240px) minmax(0, 240px)', gap: 10, alignItems: 'end' }}>
        <FilterSelect label="Type" options={['All types', ...D.TYPES]} value={f.type} onChange={set('type')} />
        <FilterSelect label="Status" options={['All statuses', ...D.STATUSES]} value={f.status} onChange={set('status')} />
        <FilterText label="From" type="datetime-local" value={f.from} onChange={set('from')} />
        <FilterText label="To" type="datetime-local" value={f.to} onChange={set('to')} />
      </div>}
      {showFilters && !scoped && <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 0.7fr 1fr 1.05fr 0.85fr 0.85fr 1.3fr 1.3fr', gap: 10, alignItems: 'end' }}>
        <FilterText label="Reference" value={f.ref} onChange={(v) => set('ref')(v.replace(/\D/g, ''))} placeholder="8 digits" maxLength={8} inputMode="numeric" />
        <FilterText label="PIN" value={f.pin} onChange={(v) => set('pin')(v.replace(/[^0-9a-z]/gi, '').toUpperCase())} placeholder="Full PIN code" maxLength={6} />
        <CustomerSearch customers={D.customers} value={f.customer} onChange={set('customer')} />
        <FilterSelect label="Business" options={bizOpts} value={f.business} onChange={set('business')} />
        <FilterSelect label="Type" options={['All types', ...D.TYPES]} value={f.type} onChange={set('type')} />
        <FilterSelect label="Status" options={['All statuses', ...D.STATUSES]} value={f.status} onChange={set('status')} />
        <FilterText label="From" type="datetime-local" value={f.from} onChange={set('from')}
          labelAction={resetStyle === 'label' ? <button type="button" onClick={reset} style={resetLink}>Reset to last 24 h</button> : null} />
        <FilterText label="To" type="datetime-local" value={f.to} onChange={set('to')}
          trailing={resetStyle === 'icon' ? <button type="button" title="Reset filters to last 24 h" aria-label="Reset filters to last 24 h" onClick={reset} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: 'var(--gray-500)', display: 'flex' }}><Icon name="VuesaxOutlineRefresh" size={16} /></button> : null} />
      </div>}

      {noRange && (
        <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderRadius: 8, background: 'var(--dale-cream)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dale-accent)', flexShrink: 0 }} />
          <span style={{ flexGrow: 1, ...monFont(400, 14, '20px', 'var(--dale-black)') }}>
            <b style={{ fontWeight: 600 }}>No date range.</b> This query scans and totals the entire ledger — it will be slow and loads the database. Add a range unless you really need all history.
          </span>
          <Button variant="standard" onClick={() => { set('from')(def.from); set('to')(def.to); }}>Use last 24 h</Button>
        </div>
      )}

      <div style={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Tables fillHeight dense
          columns={columns} rows={empty ? [] : tableRows} selectable={false}
          rowActions={loading || empty ? false : (_, i) => setOpenId(slice[i].id)}
          page={page} pageCount={loading || empty ? 1 : pageCount} onPageChange={setPage}
          resultCount={loading || empty ? undefined : rows.length}
          onFilter={() => setShowFilters((v) => !v)}
          onExport={loading || empty ? undefined : () => setExporting(rows.length)}
          pageSize={pageSize} pageSizeOptions={empty ? undefined : [25, 50, 100, 250]} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
          style={empty ? { borderRadius: '8px 8px 0 0', flexGrow: 0 } : undefined} />
        {empty && (
          <div style={{ border: '1px solid var(--dale-border-cool)', borderTop: 0, borderRadius: '0 0 8px 8px', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
            <span style={monFont(600, 16, '24px', 'var(--dale-black)')}>No transactions match these filters</span>
            <span style={{ ...monFont(400, 14, '20px', 'var(--dale-gray-medium)'), maxWidth: 420 }}>
              {f.pin ? `No transaction with PIN ${f.pin} in this range. Check the code with the caller or widen the date range.` : f.ref ? `No reference starts with ${f.ref} in this range. Ask the caller to read all 8 digits, or widen the date range.` : 'Try widening the date range or clearing a filter.'}
            </span>
            <button type="button" onClick={() => { setF(def); setPage(1); }} style={{ marginTop: 8, border: 0, background: 'none', padding: 0, cursor: 'pointer', ...monFont(500, 14, '20px', 'var(--dale-black)'), textDecoration: 'underline', textUnderlineOffset: 3 }}>Reset filters</button>
          </div>
        )}
      </div>

      {exporting != null && (
        <div role="status" style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 70, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 100, background: 'var(--dale-dark)', boxShadow: 'var(--shadow-flyout)', ...monFont(500, 13, '100%', 'var(--dale-white)') }}>
          <Icon name="TableDownload" size={16} />Exporting {exporting.toLocaleString('en-US')} transactions · CSV
        </div>
      )}
      <TransactionDrawer tx={open} data={D} onClose={() => setOpenId(null)} 
        onCancelled={(id, reason) => setTxs((all) => all.map((t) => t.id === id ? { ...t, status: 'Cancelled', cancelled: { reason }, pin: { ...t.pin, status: 'Void' } } : t))} />
    </div>
  );
}

function OperationsScreen({ query, onQuery }) {
  const parse = () => { const p = location.hash.slice(1).split('/'); return { sub: p[1] === 'customers' ? 'customers' : 'transactions', id: p[2] || null }; };
  const [route, setRoute] = React.useState(parse);
  React.useEffect(() => { history.replaceState(null, '', '#operations/' + route.sub + (route.id ? '/' + route.id : '')); }, [route]);
  const SUBS = ['transactions', 'customers'];
  return (
    <React.Fragment>
      <AdminHeader title="Operations" avatar="var(--dale-gray-medium)" query={query} onQuery={onQuery}
        tabs={<NavigationBar tabs={['Transactions', 'Customers']} active={SUBS.indexOf(route.sub)} onChange={(i) => setRoute({ sub: SUBS[i], id: null })} style={{ alignSelf: 'center', width: 280, marginTop: 6 }} />} />
      <DashboardBody style={{ minHeight: 0, overflow: 'hidden', padding: 20, gap: 20 }}>
        <ContentCard style={{ minHeight: 0, padding: '20px 20px 16px', borderRadius: 16 }}>
          {route.sub === 'transactions' ? <MonitoringTab /> : <CustomersSection openId={route.id} onOpen={(id) => setRoute({ sub: 'customers', id })} />}
        </ContentCard>
      </DashboardBody>
    </React.Fragment>
  );
}

export { OperationsScreen, MonitoringTab, TypeCell };
