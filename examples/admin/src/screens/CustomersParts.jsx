import React from 'react';
import { Button, Chips, Dialog, Dropdown, Icon, InputField } from '@dale/ui';
import { MonitoringData } from '../data/index.js';
import { fmtMoney, monFont } from './MonitoringParts.jsx';

/* Shared bits for Operations › Customers: chips, balance strip, dialogs, New Customer drawer. */
const CUST_TONE = { Active: 'Completed', Suspended: 'Pending', Cancelled: 'Failed' };
const PIN_TONE = { Active: 'Pending', Redeemed: 'Completed', Expired: 'Cancelled', Merged: 'Cancelled' };

function CustomerStatusChip({ status, size = 'small' }) {
  return <Chips status={CUST_TONE[status]} label={status} size={size} />;
}
function PinStatusChip({ status }) {
  return <Chips status={PIN_TONE[status]} label={status} size="small" />;
}
function VerifiedChip({ verified }) {
  return <Chips status={verified ? 'Completed' : 'Cancelled'} label={verified ? 'Verified' : 'Unverified'} size="small" />;
}

function balancesOf(c, pins) {
  const pin = pins.filter((p) => p.customer_id === c.id && p.status === 'Active').reduce((s, p) => s + p.remaining_amount, 0);
  return { pin, unassigned: c.unassigned_balance, total: pin + c.unassigned_balance };
}

function Money({ v, size = 14, weight = 500 }) {
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...monFont(weight, size, '100%', 'var(--dale-black)'), whiteSpace: 'nowrap' }}>{fmtMoney(v)} <span style={monFont(400, size * 0.8, '100%', 'var(--dale-gray-medium)')}>DOP</span></span>;
}

function BalanceStrip({ b }) {
  const cell = (label, v, note, strong) => (
    <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 20px', borderLeft: strong ? 0 : undefined }}>
      <span style={{ ...monFont(600, 11, '100%', 'var(--dale-gray-medium)'), letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
      {strong ? <CopyText value={fmtMoney(v)} title="Copy total balance"><Money v={v} size={22} weight={800} /></CopyText> : <Money v={v} size={18} weight={600} />}
      <span style={monFont(400, 12, '16px', 'var(--dale-gray-medium)')}>{note}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', borderRadius: 12, border: '1px solid var(--dale-border-cool)', overflow: 'hidden' }}>
      {cell('PIN Balance', b.pin, 'Remaining on active PINs')}
      <span style={{ width: 1, background: 'var(--dale-border-cool)' }} />
      {cell('Unassigned Balance', b.unassigned, 'From expired PINs, not yet converted')}
      <span style={{ width: 1, background: 'var(--dale-border-cool)' }} />
      <div style={{ flex: '1 1 0', display: 'flex', background: 'var(--dale-silver)' }}>{cell('Total Balance', b.total, 'PIN + Unassigned', true)}</div>
    </div>
  );
}

/** Click-to-copy wrapper: shows children (or the value) plus a Copy / Copied cue. */
function CopyText({ value, title, children }) {
  const [done, setDone] = React.useState(false);
  const copy = () => { navigator.clipboard && navigator.clipboard.writeText(value).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 1400); };
  return (
    <button type="button" onClick={copy} title={done ? 'Copied' : (title || 'Copy')} aria-label={title || 'Copy'} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, textAlign: 'left' }}>
      {children || value}
      <Icon name={done ? 'TableCheck' : 'TableCopy'} size={14} style={{ color: done ? 'var(--dale-green-contrast)' : 'var(--dale-gray-light)' }} />
    </button>
  );
}
function CopyId({ id }) {
  return <CopyText value={id} title="Copy customer ID"><span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: 'var(--dale-gray-hard)' }}>{id}</span></CopyText>;
}

function Overlay({ children, onClose, z = 60 }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: z, background: 'color-mix(in oklch, var(--dale-dark) 40%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/** Single Status control: Active/Suspended → PATCH …/status; Cancelled → DELETE. */
function StatusChangeDialog({ customer, to, onClose, onConfirm }) {
  const copy = {
    Active: ['Reactivate this customer?', 'They can buy, send and redeem PINs again.', 'Reactivate', 'continue'],
    Suspended: ['Suspend this customer?', 'New transactions are blocked. Active PINs keep their balance and can still expire into Unassigned Balance. Reversible.', 'Suspend', 'standard'],
    Cancelled: ['Cancel this customer?', 'The account is closed. Any remaining balance stays on record for reconciliation. This is the DELETE action.', 'Cancel customer', 'error'],
  }[to];
  return (
    <Overlay onClose={onClose}>
      <Dialog title={copy[0]} style={{ width: 420 }} supportingText={`${customer.name} · ${customer.phone}. ${copy[1]}`}
        actions={<React.Fragment><Button variant="standard" onClick={onClose}>Keep {customer.status.toLowerCase()}</Button><Button variant={copy[3]} onClick={onConfirm}>{copy[2]}</Button></React.Fragment>} />
    </Overlay>
  );
}

function MergeDialog({ pins, onClose, onConfirm }) {
  const total = pins.reduce((s, p) => s + p.remaining_amount, 0);
  return (
    <Overlay onClose={onClose}>
      <Dialog title={`Merge ${pins.length} PINs?`} style={{ width: 420 }}
        supportingText={`${pins.map((p) => p.code).join(', ')} become Merged. One new active PIN for ${fmtMoney(total)} DOP is created and its code is sent to the customer by SMS.`}
        actions={<React.Fragment><Button variant="standard" onClick={onClose}>Back</Button><Button variant="continue" onClick={onConfirm}>Merge PINs</Button></React.Fragment>} />
    </Overlay>
  );
}

function Toast({ children }) {
  return <div role="status" style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 80, padding: '12px 18px', borderRadius: 100, background: 'var(--dale-dark)', boxShadow: 'var(--shadow-flyout)', ...monFont(500, 13, '100%', 'var(--dale-white)') }}>{children}</div>;
}

function TextArea({ label, value, onChange, max = 4000, disabled, hint }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', ...monFont(400, 16, 1.4, disabled ? 'var(--text-disabled-default)' : 'var(--gray-900)') }}>{label}<span style={monFont(400, 12, 1.4, 'var(--dale-gray-medium)')}>{value.length}/{max}</span></span>
      {hint && <span style={monFont(400, 13, '18px', 'var(--dale-gray-medium)')}>{hint}</span>}
      <textarea value={value} disabled={disabled} maxLength={max} rows={3} onChange={(e) => onChange(e.target.value)}
        style={{ resize: 'vertical', borderRadius: 8, border: '1px solid ' + (disabled ? 'var(--border-disabled-default)' : 'var(--border-field)'), background: disabled ? 'var(--background-disabled-default)' : 'var(--dale-white)', padding: '12px 16px', outline: 'none', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: '20px', color: disabled ? 'var(--text-disabled-on-disabled)' : 'var(--gray-900)' }} />
    </label>
  );
}

function NewCustomerDrawer({ customers, onClose, onCreate }) {
  const D = MonitoringData;
  const [v, setV] = React.useState({ first_name: '', last_name: '', phone: '', country: D.COUNTRIES[0], email: '', metadata: '' });
  const [tried, setTried] = React.useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e && e.target ? e.target.value : e }));
  const digits = v.phone.replace(/\D/g, '');
  const phoneFmt = digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : v.phone;
  const dup = digits.length === 10 && customers.find((c) => c.phone.replace(/\D/g, '') === digits);
  const err = {
    first_name: !v.first_name.trim() && 'Required',
    last_name: !v.last_name.trim() && 'Required',
    phone: digits.length !== 10 ? 'Enter a 10-digit number (809, 829 or 849)' : dup ? `Already registered to ${dup.name}` : null,
    email: v.email && !/^\S+@\S+\.\S+$/.test(v.email) && 'Not a valid email',
  };
  const ok = !Object.values(err).some(Boolean);
  const submit = () => { setTried(true); if (ok) onCreate({ ...v, phone: phoneFmt }); };
  const field = (k, label, extra) => (
    <InputField label={label} value={v[k]} onChange={set(k)} state={tried && err[k] ? 'error' : 'default'} error={tried && err[k] ? err[k] : undefined} style={{ alignSelf: 'stretch' }} {...extra} />
  );
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 39, background: 'color-mix(in oklch, var(--dale-dark) 18%, transparent)' }} />
      <aside role="dialog" aria-label="New customer" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, zIndex: 40, background: 'var(--dale-white)', boxShadow: 'var(--shadow-flyout)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 32px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--dale-border-cool)' }}>
          <span style={monFont(800, 24, '100%', 'var(--dale-black)')}>New customer</span>
          <button type="button" aria-label="Close" onClick={onClose} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: 'var(--dale-gray-hard)', display: 'flex' }}><Icon name="Close" size={22} /></button>
        </div>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={monFont(400, 14, '20px', 'var(--dale-gray-medium)')}>Pre-register someone before their first transaction. Created in one step — no review.</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>{field('first_name', 'First name *')}{field('last_name', 'Last name *')}</div>
          {field('phone', 'Phone number *')}
          <div style={{ position: 'relative', height: 72 }}><Dropdown label="Country *" options={D.COUNTRIES} value={v.country} onChange={set('country')} style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 5 }} /></div>
          {field('email', 'Email')}
          <TextArea label="Metadata" value={v.metadata} onChange={set('metadata')} hint="Free text. Current use isn't documented — leave empty unless told otherwise." />
          <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 8, background: 'var(--dale-silver)' }}>
            <Icon name="MobileCheck" size={20} style={{ color: 'var(--dale-gray-hard)' }} />
            <span style={monFont(400, 13, '20px', 'var(--dale-gray-hard)')}>The phone stays <b style={{ fontWeight: 600 }}>unverified</b> until the customer confirms it with an OTP in their first real transaction — same as a self-registered customer.</span>
          </div>
        </div>
        <div style={{ padding: '16px 32px 24px', borderTop: '1px solid var(--dale-border-cool)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button variant="standard" onClick={onClose}>Cancel</Button>
          <Button variant="continue" icon={<Icon name="Add" size={20} />} onClick={submit}>Create customer</Button>
        </div>
      </aside>
    </React.Fragment>
  );
}

export { CopyText, CustomerStatusChip, PinStatusChip, VerifiedChip, balancesOf, Money, BalanceStrip, CopyId, Overlay, StatusChangeDialog, MergeDialog, Toast, TextArea, NewCustomerDrawer };
