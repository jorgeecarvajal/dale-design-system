import React from 'react';
import { Button, Checkboxes, Dropdown, Icon, InputField, NavigationBar, Tables } from '@dale/ui';
import { MonitoringData } from '../data/index.js';
import { FilterSelect, FilterText, LinkText, fmtDate, fmtDateLong, fmtMoney, monFont } from './MonitoringParts.jsx';
import { BalanceStrip, CopyId, CopyText, CustomerStatusChip, MergeDialog, Money, NewCustomerDrawer, PinStatusChip, StatusChangeDialog, TextArea, Toast, VerifiedChip, balancesOf } from './CustomersParts.jsx';
import { MonitoringTab } from './OperationsScreen.jsx';

/* Operations › Customers — list, + New Customer, and the customer profile
   (header with identity + balance strip, tabs Profile · PINs · Activity). */

function CustomersList({ customers, pins, onOpen, onNew }) {
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState('All statuses');
  const [ver, setVer] = React.useState('All');
  const [showFilters, setShowFilters] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const digits = q.replace(/\D/g, '');
  const rows = customers.filter((c) => {
    if (q.trim() && !(c.name.toLowerCase().includes(q.toLowerCase()) || (digits && c.phone.replace(/\D/g, '').includes(digits)))) return false;
    if (status !== 'All statuses' && c.status !== status) return false;
    if (ver !== 'All' && c.phone_verified !== (ver === 'Verified')) return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const slice = rows.slice((page - 1) * pageSize, page * pageSize);
  const columns = [
    { key: 'name', label: 'Customer', sortable: false }, { key: 'phone', label: 'Phone', sortable: false },
    { key: 'verified', label: 'Phone verified', sortable: false }, { key: 'status', label: 'Status', sortable: false },
    { key: 'country', label: 'Country', sortable: false }, { key: 'total', label: 'Total balance', sortable: false },
    { key: 'since', label: 'Customer since', sortable: false },
  ];
  const tableRows = slice.map((c) => ({
    name: <LinkText onClick={() => onOpen(c.id)}>{c.name}</LinkText>,
    phone: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{c.phone}</span>,
    verified: <VerifiedChip verified={c.phone_verified} />,
    status: <CustomerStatusChip status={c.status} />,
    country: c.country,
    total: <Money v={balancesOf(c, pins).total} />,
    since: c.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'stretch', minWidth: 0, flexGrow: 1, minHeight: 0 }}>
      {showFilters && <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 320px) minmax(0, 200px) minmax(0, 200px)', gap: 10, alignItems: 'end' }}>
        <FilterText label="Search" value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Phone or name" />
        <FilterSelect label="Status" options={['All statuses', ...MonitoringData.CUSTOMER_STATUSES]} value={status} onChange={(v) => { setStatus(v); setPage(1); }} />
        <FilterSelect label="Phone verified" options={['All', 'Verified', 'Unverified']} value={ver} onChange={(v) => { setVer(v); setPage(1); }} />
      </div>}
      <div style={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Tables fillHeight dense columns={columns} rows={tableRows} selectable={false}
          rowActions={(_, i) => onOpen(slice[i].id)}
          resultCount={rows.length} onFilter={() => setShowFilters((s) => !s)} onAdd={onNew} addLabel="New Customer"
          page={page} pageCount={pageCount} onPageChange={setPage}
          pageSize={pageSize} pageSizeOptions={[25, 50, 100, 250]} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
      </div>
    </div>
  );
}

function ProfileTab({ c, editing, draft, setDraft }) {
  const ro = (label, value) => <InputField label={label} value={value} state="disabled" style={{ alignSelf: 'stretch' }} />;
  const ed = (k, label) => editing
    ? <InputField label={label} value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} style={{ alignSelf: 'stretch' }} />
    : <InputField label={label} value={c[k] || '—'} valueType={c[k] ? 'default' : 'placeholder'} style={{ alignSelf: 'stretch' }} />;
  const group = (title, note, children) => (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ ...monFont(600, 12, '100%', 'var(--dale-gray-medium)'), letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</span>
        <span style={monFont(400, 12, '16px', 'var(--dale-gray-light)')}>{note}</span>
      </div>
      {children}
    </section>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 40, alignItems: 'start', maxWidth: 1100 }}>
      {group('Contact', editing ? 'Editing — save or cancel in the header' : 'Editable via Edit Profile', (
        <React.Fragment>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>{ed('first_name', 'First name')}{ed('last_name', 'Last name')}</div>
          {ed('email', 'Email')}
          <TextArea label="Metadata" value={editing ? draft.metadata : c.metadata} disabled={!editing} onChange={(v) => setDraft((d) => ({ ...d, metadata: v }))}
            hint="Free text, up to 4,000 characters. Current use isn't documented." />
        </React.Fragment>
      ))}
      {group('Identity', 'Read only', (
        <React.Fragment>
          {ro('Phone number', c.phone)}
          {ro('Country', c.country)}
          {ro('Phone verified', c.phone_verified ? 'Yes — confirmed by OTP' : 'No — pending first OTP')}
          {ro('Updated at', fmtDateLong(c.updated_at))}
        </React.Fragment>
      ))}
    </div>
  );
}

function PinsTab({ c, pins, onMerge, onResend }) {
  const D = MonitoringData;
  const mine = pins.filter((p) => p.customer_id === c.id).sort((a, b) => b.created_at - a.created_at);
  const [filter, setFilter] = React.useState(null);
  const [sel, setSel] = React.useState(() => new Set());
  const [merging, setMerging] = React.useState(false);
  React.useEffect(() => setSel(new Set()), [c.id]);
  const rows = filter ? mine.filter((p) => p.status === filter) : mine;
  const toggle = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selected = mine.filter((p) => sel.has(p.id) && p.status === 'Active');
  const counts = D.PIN_STATUSES.map((s) => [s, mine.filter((p) => p.status === s).length]);
  const columns = [
    { key: 'sel', label: '', sortable: false }, { key: 'code', label: 'PIN', sortable: false }, { key: 'amount', label: 'Amount', sortable: false },
    { key: 'remaining', label: 'Remaining', sortable: false }, { key: 'status', label: 'Status', sortable: false },
    { key: 'created', label: 'Created at', sortable: false }, { key: 'due', label: 'Due at', sortable: false }, { key: 'act', label: '', sortable: false },
  ];
  const tableRows = rows.map((p) => ({
    sel: p.status === 'Active' ? <Checkboxes checked={sel.has(p.id)} onChange={() => toggle(p.id)} tone="var(--dale-dark)" style={{ margin: '-10px 0' }} /> : <span style={{ display: 'block', width: 40 }} />,
    code: <span style={{ ...monFont(600, 14, '20px', 'var(--dale-black)'), letterSpacing: '0.06em' }}>{p.code}{p.merged_result && <span style={{ ...monFont(500, 11, '100%', 'var(--dale-gray-medium)'), letterSpacing: 0, marginLeft: 8 }}>merged</span>}</span>,
    amount: <Money v={p.amount} />, remaining: <Money v={p.remaining_amount} weight={p.remaining_amount ? 600 : 400} />,
    status: <PinStatusChip status={p.status} />, created: fmtDate(p.created_at), due: fmtDate(p.due_at),
    act: p.merged_result && p.status === 'Active'
      ? <button type="button" onClick={() => onResend(p)} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, ...monFont(500, 13, '100%', 'var(--dale-gray-hard)'), whiteSpace: 'nowrap' }}><Icon name="Reply" size={16} />Resend code</button>
      : null,
  }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexGrow: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setFilter(null)} style={pinFilterBtn(!filter)}>All <b style={{ fontWeight: 700 }}>{mine.length}</b></button>
        {counts.map(([s, n]) => <button key={s} type="button" onClick={() => setFilter(filter === s ? null : s)} style={pinFilterBtn(filter === s)}>{s} <b style={{ fontWeight: 700 }}>{n}</b></button>)}
        <span style={{ flexGrow: 1 }} />
        <span style={monFont(400, 13, '100%', 'var(--dale-gray-medium)')}>{selected.length ? `${selected.length} active selected · ${fmtMoney(selected.reduce((s, p) => s + p.remaining_amount, 0))} DOP` : 'Select 2+ active PINs to merge'}</span>
        <Button variant="continue" disabled={selected.length < 2} icon={<Icon name="VuesaxOutlineArrangeSquare" size={20} />} onClick={() => setMerging(true)}>Merge</Button>
      </div>
      <div style={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Tables fillHeight dense columns={columns} rows={tableRows} selectable={false} rowActions={false} resultCount={rows.length} />
      </div>
      {merging && <MergeDialog pins={selected} onClose={() => setMerging(false)} onConfirm={() => { setMerging(false); onMerge(selected); setSel(new Set()); }} />}
    </div>
  );
}
const pinFilterBtn = (on) => ({ height: 32, padding: '0 14px', borderRadius: 100, border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, background: on ? 'var(--dale-dark)' : 'var(--dale-silver)', ...monFont(500, 13, '100%', on ? 'var(--dale-white)' : 'var(--dale-gray-hard)') });

function CustomerDetail({ c, pins, onBack, onUpdate, onMerge, onResend }) {
  const [tab, setTab] = React.useState(0);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(null);
  const [statusTo, setStatusTo] = React.useState(null);
  React.useEffect(() => { setTab(0); setEditing(false); }, [c.id]);
  const b = balancesOf(c, pins);
  const startEdit = () => { setDraft({ first_name: c.first_name, last_name: c.last_name, email: c.email, metadata: c.metadata }); setEditing(true); setTab(0); };
  const save = () => { onUpdate({ ...draft, name: `${draft.first_name} ${draft.last_name}`.trim(), updated_at: new Date() }); setEditing(false); };
  const meta = (k, v) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={monFont(400, 13, '100%', 'var(--dale-gray-medium)')}>{k}</span><span style={monFont(500, 13, '100%', 'var(--dale-black)')}>{v}</span></span>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'stretch', minWidth: 0, flexGrow: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
        <button type="button" onClick={onBack} style={{ alignSelf: 'flex-start', border: 0, background: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, ...monFont(500, 13, '100%', 'var(--dale-gray-medium)') }}>
          <Icon name="TableChevronLeft" size={16} />Customers
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={monFont(800, 28, '100%', 'var(--dale-black)')}>{c.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <CopyText value={c.phone} title="Copy phone number"><span style={{ ...monFont(600, 16, '100%', 'var(--dale-black)'), fontVariantNumeric: 'tabular-nums' }}>{c.phone}</span></CopyText>
              <VerifiedChip verified={c.phone_verified} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {meta('Country', c.country)}
              {meta('Customer since', c.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={monFont(400, 13, '100%', 'var(--dale-gray-medium)')}>ID</span><CopyId id={c.customer_id} /></span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ position: 'relative', width: 180, height: 62 }}>
              <Dropdown dense key={c.status} label="Status" options={MonitoringData.CUSTOMER_STATUSES} defaultValue={c.status}
                onChange={(v) => v !== c.status && setStatusTo(v)} style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6 }} />
            </div>
            {editing
              ? <div style={{ display: 'flex', gap: 8, paddingBottom: 1 }}><Button variant="standard" onClick={() => setEditing(false)}>Cancel</Button><Button variant="continue" icon={null} onClick={save}>Save changes</Button></div>
              : <div style={{ paddingBottom: 1 }}><Button variant="standard" onClick={startEdit}>Edit Profile</Button></div>}
          </div>
        </div>
        <BalanceStrip b={b} />
      </div>
      <NavigationBar tabs={['Profile', 'PINs', 'Activity']} active={tab} onChange={setTab} style={{ flexShrink: 0 }} />
      <div style={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: tab === 0 ? 'auto' : 'hidden' }}>
        {tab === 0 && <ProfileTab c={c} editing={editing} draft={draft} setDraft={setDraft} />}
        {tab === 1 && <PinsTab c={c} pins={pins} onMerge={onMerge} onResend={onResend} />}
        {tab === 2 && <MonitoringTab key={c.id} customerId={c.id} />}
      </div>
      {statusTo && <StatusChangeDialog customer={c} to={statusTo} onClose={() => setStatusTo(null)} onConfirm={() => { onUpdate({ status: statusTo, updated_at: new Date() }); setStatusTo(null); }} />}
    </div>
  );
}

function CustomersSection({ openId, onOpen }) {
  const D = MonitoringData;
  const [customers, setCustomers] = React.useState(D.customers);
  const [pins, setPins] = React.useState(D.pins);
  const [creating, setCreating] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2800); return () => clearTimeout(t); }, [toast]);
  const c = customers.find((x) => x.id === openId);
  const update = (patch) => setCustomers((all) => all.map((x) => x.id === openId ? { ...x, ...patch } : x));
  const merge = (sel) => {
    const now = new Date(D.NOW);
    const full = String(1000 + Math.floor(Math.random() * 8999)) + 'M' + Math.floor(Math.random() * 10);
    const total = sel.reduce((s, p) => s + p.remaining_amount, 0);
    const ids = new Set(sel.map((p) => p.id));
    setPins((all) => [{ id: 'pin_m' + Date.now(), customer_id: openId, code_full: full, code: '****' + full.slice(-2), amount: total, remaining_amount: total, status: 'Active', created_at: now, due_at: new Date(now.getTime() + 3 * 864e5), merged_result: true },
      ...all.map((p) => ids.has(p.id) ? { ...p, status: 'Merged', remaining_amount: 0 } : p)]);
    setToast(`Merged ${sel.length} PINs into one for ${fmtMoney(total)} DOP · code sent by SMS`);
  };
  const create = (v) => {
    const now = new Date(D.NOW);
    const nc = { id: 'cn' + Date.now(), first_name: v.first_name.trim(), last_name: v.last_name.trim(), name: `${v.first_name.trim()} ${v.last_name.trim()}`, phone: v.phone, country: v.country, email: v.email, metadata: v.metadata,
      customer_id: D.uuid(), phone_verified: false, status: 'Active', created_at: now, updated_at: now, unassigned_balance: 0, balance: 0, kyc: 'Pending', joined: now.toISOString().slice(0, 10) };
    D.customers.unshift(nc);
    setCustomers((all) => [nc, ...all]);
    setCreating(false); onOpen(nc.id); setToast(`${nc.name} created · phone unverified until first OTP`);
  };
  return (
    <React.Fragment>
      {c
        ? <CustomerDetail c={c} pins={pins} onBack={() => onOpen(null)} onUpdate={update} onMerge={merge} onResend={(p) => setToast(`Code for PIN ${p.code} re-sent by SMS to ${c.phone}`)} />
        : <CustomersList customers={customers} pins={pins} onOpen={onOpen} onNew={() => setCreating(true)} />}
      {creating && <NewCustomerDrawer customers={customers} onClose={() => setCreating(false)} onCreate={create} />}
      {toast && <Toast>{toast}</Toast>}
    </React.Fragment>
  );
}

export { CustomersSection };
