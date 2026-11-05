import React from 'react';
import { Actions, Button, Dropdown, InputField, NavigationBar, Switch, Tables } from '@dale/ui';
import { AdminHeader, ContentCard, DashboardBody } from './AdminChrome.jsx';

/* Agent Network + Aggregators — Hi-Res RevG frames:
   Agent Network > Home (141:20103) · Edit Profile (94:17212) · Bank Accounts (94:16207)
   · Bank Accounts > Edit (94:16992) · Fees (94:16529) · Locations (113:17564) · Locations > Detail (113:17711)
   Aggregators > Home (137:19736) · Edit Profile · Bank Accounts (45:14219) · Bank Accounts > Edit (75:15071) · Fees (56:14465)
   Both sections share one data model, so they share these parts. */

const bz = (w, s, c) => ({ fontFamily: 'var(--font-ui)', fontWeight: w, fontSize: s, lineHeight: '100%', color: c, whiteSpace: 'nowrap' });
const BIZ_STATUSES = ['Draft', 'Pending Review', 'Approved', 'Rejected', 'Suspended'];
const BANKS = [
  { bank: 'Banco Popular', acct: '•••• 4821', cur: 'USD', type: 'Checking', status: 'Active' },
  { bank: 'Banreservas', acct: '•••• 1187', cur: 'USD', type: 'Savings', status: 'Inactive' },
  { bank: 'Scotiabank', acct: '•••• 7734', cur: 'DOP', type: 'Checking', status: 'Active' },
  { bank: 'Banco BHD', acct: '•••• 2098', cur: 'USD', type: 'Time deposit', status: 'Active' },
  { bank: 'Banco Progreso', acct: '•••• 4412', cur: 'DOP', type: 'Checking', status: 'Inactive' },
  { bank: 'Banco Adopem', acct: '•••• 6630', cur: 'USD', type: 'Savings', status: 'Active' },
];
const LOCS = [
  ['GBC Luperón, Cerca del Bravo', 'NY, USA', '40.7128° N, 74.0060° W'],
  ['En la 27 de febrero, Frente al Malecón', 'CA, USA', '34.0522° N, 118.2437° W'],
  ['Cerca del Parque Independencia', 'TX, USA', '29.7604° N, 95.3698° W'],
  ['Entre Abraham Lincoln y Núñez de Cáceres', 'IL, USA', '41.8781° N, 87.6298° W'],
  ['Cerca del Estadio Quisqueya', 'FL, USA', '25.7617° N, 80.1918° W'],
  ['Frente al Palacio de Bellas Artes', 'WA, USA', '47.6062° N, 122.3321° W'],
  ['Cerca del Faro a Colón', 'GA, USA', '33.7489° N, 84.3879° W'],
  ['En la Avenida 27 de febrero', 'MI, USA', '42.3314° N, 83.0458° W'],
  ['Cerca del Acuario Nacional', 'OH, USA', '39.9612° N, 82.9988° W'],
  ['Entre Winston Churchill y 27 de febrero', 'NC, USA', '35.7796° N, 78.6382° W'],
  ['Cerca del Centro Olímpico', 'VA, USA', '38.5816° N, 77.0365° W'],
  ['Frente al Museo del Hombre Dominicano', 'AZ, USA', '33.4484° N, 112.0740° W'],
  ['Cerca del Malecón, entre Billini y El Conde', 'CO, USA', '39.7392° N, 104.9903° W'],
  ['Cerca de la Plaza España', 'OR, USA', '45.5231° N, 122.6765° W'],
].map(([address, region, coords], i) => ({ id: 'LOC-' + String(i + 1).padStart(3, '0'), address, region, coords, status: i % 5 === 3 ? 'Inactive' : 'Active' }));

const BIZ_CONFIG = {
  'agent-network': {
    title: 'Agent Network', sub: 'Manage your agent networks accounts and locations.',
    tabs: ['Home', 'Edit Profile', 'Bank Accounts', 'Fees', 'Locations'], channel: true,
    rows: [{ id: 'gbc', name: 'Farmacias GBC', enabled: true, country: 'Dominican Republic', feeIn: '0.5%', feeOut: '2%', locations: LOCS.length, status: 'Approved', registered: 'Oct 12, 2023', type: 'Chains', taxId: '1-31-55555-2' }],
  },
  aggregators: {
    title: 'Aggregators', sub: 'Manage your aggregators accounts.',
    tabs: ['Home', 'Edit Profile', 'Bank Accounts', 'Fees'], channel: false,
    rows: [{ id: 'midas', name: 'Midas', enabled: true, country: 'Dominican Republic', feeIn: '0%', feeOut: '2%', status: 'Approved', registered: 'Mar 3, 2024', type: 'Sole Proprietorship', taxId: '1-30-12345-6' }],
  },
};

function SectionHead({ title, sub, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, alignSelf: 'stretch', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={bz(700, 24, 'var(--ui-ink-900)')}>{title}</span>
        {sub && <span style={bz(400, 14, 'var(--ui-ink-500)')}>{sub}</span>}
      </div>
      {children && <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{children}</div>}
    </div>
  );
}
const FormTitle = ({ children, size = 24 }) => <span style={bz(700, size, 'var(--ui-ink-900)')}>{children}</span>;
const Rule = () => <div style={{ height: 1, background: 'var(--ui-line-200)', alignSelf: 'stretch' }} />;
function Grid2({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px 32px', alignSelf: 'stretch' }}>{children}</div>; }
const Full = ({ children }) => <div style={{ gridColumn: '1 / -1' }}>{children}</div>;

function Field({ label, value = '', placeholder = 'Value' }) {
  const [v, setV] = React.useState(value);
  return <InputField label={label} value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)} style={{ width: '100%' }} />;
}
function Pick({ label, options, value }) {
  const [v, setV] = React.useState(value ?? options[0]);
  return <Dropdown label={label} options={options} value={v} onChange={setV} />;
}

/* Status pills on Edit Profile: outlined, the current one filled green. */
function StatusPills({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {BIZ_STATUSES.map((s) => {
        const on = s === value;
        return <button key={s} type="button" onClick={() => onChange(s)} style={{ height: 30, padding: '0 12px', borderRadius: 100, border: 0, cursor: 'pointer', background: on ? 'var(--status-success)' : 'var(--surface-card)', boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--ui-line-300)', ...bz(500, 14, on ? 'var(--dale-white)' : 'var(--ui-ink-500)') }}>{s}</button>;
      })}
    </div>
  );
}

/* Fee structure segmented control: grey track, dark selected segment. */
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', padding: 3, borderRadius: 4, background: 'var(--ui-fill-100)', maxWidth: 800, alignSelf: 'flex-start', width: '100%', boxSizing: 'border-box' }}>
      {options.map((o) => {
        const on = o === value;
        return <button key={o} type="button" onClick={() => onChange(o)} style={{ flex: '1 1 0', height: 36, padding: '0 12px', textAlign: 'left', border: 0, borderRadius: 4, cursor: 'pointer', background: on ? 'var(--dale-dark)' : 'transparent', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 14, color: on ? 'var(--dale-white)' : 'var(--dale-gray-hard)', whiteSpace: 'nowrap' }}>{o}</button>;
      })}
    </div>
  );
}

function BizHome({ cfg, rows, setRows, onOpen }) {
  const cols = [
    { key: 'name', label: 'NAME', bold: true },
    { key: 'sw', label: 'STATUS', sortable: false },
    { key: 'country', label: 'COUNTRY' },
    { key: 'feeIn', label: 'FEE CASH-IN' },
    { key: 'feeOut', label: 'FEE CASH-OUT' },
  ];
  if (cfg.channel) cols.push({ key: 'locations', label: 'LOCATIONS' });
  return (
    <React.Fragment>
      <SectionHead title={cfg.title} sub={cfg.sub}><Actions onExport={() => {}} onPrimary={() => {}} primaryLabel="Add" /></SectionHead>
      <Tables style={{ alignSelf: 'stretch' }} selectable={false} columns={cols}
        rows={rows.map((r) => ({ ...r, sw: <Switch checked={r.enabled} onChange={() => setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)))} /> }))}
        rowActions={(row, i) => onOpen(rows[i].id)} resultCount={rows.length} page={1} pageCount={1} />
    </React.Fragment>
  );
}

function BizProfile({ cfg, row, onSave }) {
  const [status, setStatus] = React.useState(row.status);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignSelf: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingBottom: 16, borderBottom: '1px solid var(--ui-line-200)' }}>
        <StatusPills value={status} onChange={setStatus} />
        <span style={{ display: 'flex', gap: 8 }}><span style={bz(600, 14, 'var(--ui-ink-500)')}>Registration Date:</span><span style={bz(400, 14, 'var(--ui-ink-500)')}>{row.registered}</span></span>
      </div>
      {cfg.channel && <Grid2><Pick label="Aggregator Channel" options={['Midas']} /></Grid2>}
      <FormTitle>Business Information</FormTitle>
      <Grid2>
        <Full><Field label="Name" value={row.name} /></Full>
        <Field label="Tax Id" value={row.taxId} />
        <Pick label="Business Type" options={['Chains', 'Sole Proprietorship', 'Partnership', 'Non-Profit']} value={row.type} />
      </Grid2>
      <Rule />
      <FormTitle>Location</FormTitle>
      <Grid2>
        <Full><Field label="Address" /></Full>
        <Field label="Address Reference" /><Field label="City" />
        <Field label="Region" /><Pick label="Country" options={['República Dominicana', 'El Salvador']} />
      </Grid2>
      <Rule />
      <FormTitle>Contact Information</FormTitle>
      <Grid2><Field label="Contact Email" /><Field label="Contact Phone" /></Grid2>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="standard" icon={null} onClick={onSave}>Save Changes</Button></div>
    </div>
  );
}

function BankEdit({ acct, onBack }) {
  const [active, setActive] = React.useState(acct ? acct.status === 'Active' : true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignSelf: 'stretch' }}>
      <SectionHead title={acct ? `${acct.bank} ${acct.acct}` : 'New bank account'}>
        <Button variant="secondary" icon={null} onClick={onBack}>Cancel</Button>
        <Button variant="standard" icon={null} onClick={onBack}>Save</Button>
      </SectionHead>
      <FormTitle size={18}>Bank Identification</FormTitle>
      <Grid2>
        <Pick label="Country" options={['Dominican Republic', 'El Salvador']} />
        <Pick label="Currency" options={['USD', 'DOP']} value={acct?.cur} />
        <Pick label="Type" options={['Bank', 'Cooperative']} />
        <Field label="Bank Code" />
        <Full><Field label="Bank" value={acct?.bank} /></Full>
      </Grid2>
      <Rule />
      <FormTitle size={18}>Account Details</FormTitle>
      <Grid2>
        <Full><Field label="Account Holder Name" /></Full>
        <Field label="Account Number" value={acct?.acct} />
        <Pick label="Account Type" options={['Checking', 'Savings', 'Time deposit']} value={acct?.type} />
      </Grid2>
      <span style={bz(500, 14, 'var(--ui-ink-500)')}>Optional</span>
      <Grid2><Field label="Account Holder ID" /><Field label="Email" /></Grid2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={bz(500, 14, 'var(--ui-ink-800)')}>Active</span><Switch checked={active} onChange={(e) => setActive(e.target.checked)} /></div>
    </div>
  );
}

function BizBanks() {
  const [edit, setEdit] = React.useState(undefined);
  if (edit !== undefined) return <BankEdit acct={edit} onBack={() => setEdit(undefined)} />;
  return (
    <React.Fragment>
      <SectionHead title="Bank Accounts" sub="Manage registered accounts for operations and payments." />
      <Tables style={{ alignSelf: 'stretch' }} selectable={false}
        columns={[{ key: 'bank', label: 'Bank', bold: true }, { key: 'acct', label: 'Account number' }, { key: 'cur', label: 'Currency' }, { key: 'type', label: 'Account type' }, { key: 'status', label: 'Status', type: 'status' }]}
        rows={BANKS} rowActions={(row, i) => setEdit(BANKS[i])} onAdd={() => setEdit(null)} addLabel="Add"
        resultCount={BANKS.length} page={1} pageCount={1} />
    </React.Fragment>
  );
}

function FeeBlock({ title, minimum }) {
  const [mode, setMode] = React.useState('Percentage + fixed amount');
  const pctOn = mode !== 'Fixed amount only', fixOn = mode !== 'Percentage only';
  const help = { 'Percentage only': 'Total fee = percentage of the transaction amount', 'Fixed amount only': 'Total fee = fixed fee', 'Percentage + fixed amount': 'Total fee = percentage of the transaction amount + fixed fee' }[mode];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignSelf: 'stretch' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, lineHeight: '100%', color: 'var(--dale-gray-hard)' }}>{title}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={bz(700, 14, 'var(--dale-black-pure)')}>Fee structure</span>
        <Segmented options={['Percentage only', 'Fixed amount only', 'Percentage + fixed amount']} value={mode} onChange={setMode} />
      </div>
      <Grid2>
        {pctOn && <Field label="Percentage fee (%)" />}
        {fixOn && <Field label="Fixed fee" placeholder="00.00" />}
      </Grid2>
      <span style={bz(400, 14, 'var(--ui-ink-500)')}>{help}</span>
      {minimum && <Grid2><Field label="Minimum amount" /></Grid2>}
    </div>
  );
}

function LocationDetail({ loc, onBack }) {
  const [active, setActive] = React.useState(loc.status === 'Active');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignSelf: 'stretch' }}>
      <SectionHead title="Location Information">
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={bz(500, 14, 'var(--ui-ink-800)')}>Active</span><Switch checked={active} onChange={(e) => setActive(e.target.checked)} /></span>
        <Button variant="standard" icon={null} onClick={onBack}>Save</Button>
      </SectionHead>
      <FormTitle size={18}>Location Details</FormTitle>
      <Grid2><Field label="Location ID" value={loc.id} /><Field label="Location Name" /></Grid2>
      <Rule />
      <FormTitle size={18}>Location</FormTitle>
      <Grid2>
        <Full><Field label="Address" value={loc.address} /></Full>
        <Field label="Address Reference" /><Field label="City" />
        <Field label="Region" value={loc.region} /><Field label="Coordinates" value={loc.coords} />
      </Grid2>
      <Rule />
      <FormTitle size={18}>Contact Information</FormTitle>
      <Grid2><Field label="Contact Email" /><Field label="Contact Phone" /></Grid2>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="secondary" icon={null} onClick={onBack}>Back to Locations</Button></div>
    </div>
  );
}

function BizLocations() {
  const [open, setOpen] = React.useState(null);
  if (open) return <LocationDetail loc={open} onBack={() => setOpen(null)} />;
  return (
    <Tables style={{ alignSelf: 'stretch' }} title="Locations" description="Every point of service registered for this agent network."
      columns={[{ key: 'id', label: 'ID', bold: true }, { key: 'address', label: 'Address' }, { key: 'coords', label: 'Coordinates' }, { key: 'status', label: 'Status', type: 'status' }]}
      rows={LOCS} rowActions={(row, i) => setOpen(LOCS[i])} onExport={() => {}} onAdd={() => setOpen({ id: 'LOC-' + String(LOCS.length + 1).padStart(3, '0'), address: '', region: '', coords: '', status: 'Active' })} addLabel="Add"
      resultCount={LOCS.length} page={1} pageCount={1} />
  );
}

function BusinessSection({ kind, query, onQuery }) {
  const cfg = BIZ_CONFIG[kind];
  const [rows, setRows] = React.useState(cfg.rows);
  const [tab, setTab] = React.useState(0);
  const row = rows[0];
  const name = cfg.tabs[tab];
  return (
    <React.Fragment>
      <AdminHeader title={cfg.title} avatar="var(--dale-gray-medium)" query={query} onQuery={onQuery} />
      <DashboardBody>
        <ContentCard style={{ padding: '37px 32px', gap: 32 }}>
          <NavigationBar tabs={cfg.tabs} active={tab} onChange={setTab} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 8px', boxSizing: 'border-box', alignSelf: 'stretch' }}>
            {name === 'Home' && <BizHome cfg={cfg} rows={rows} setRows={setRows} onOpen={() => setTab(1)} />}
            {name === 'Edit Profile' && <BizProfile cfg={cfg} row={row} onSave={() => setTab(0)} />}
            {name === 'Bank Accounts' && <BizBanks />}
            {name === 'Fees' && <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}><FeeBlock title="Cash-In" /><Rule /><FeeBlock title="Cash-Out" minimum /></div>}
            {name === 'Locations' && <BizLocations />}
          </div>
        </ContentCard>
      </DashboardBody>
    </React.Fragment>
  );
}

const AgentNetworkScreen = (p) => <BusinessSection kind="agent-network" {...p} />;
const AggregatorsScreen = (p) => <BusinessSection kind="aggregators" {...p} />;
export { AgentNetworkScreen, AggregatorsScreen, BusinessSection };
