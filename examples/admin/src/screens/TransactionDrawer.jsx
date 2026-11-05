import React from 'react';
import { Button, Dialog, Icon } from '@dale/ui';
import { StatusPill, fmtDate, fmtDateLong, fmtMoney, monFont } from './MonitoringParts.jsx';

/* Transaction detail drawer + cross-link preview + cancel dialog. */
const CANCEL_REASONS = ['Customer request', 'Agent error', 'Duplicate transaction', 'Suspected fraud', 'Other'];

function DrawerSection({ title, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={{ ...monFont(600, 12, '100%', 'var(--dale-gray-medium)'), letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
    </section>
  );
}
function KV({ k, v, strong, note }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--dale-border-cool)' }}>
      <span style={monFont(400, 14, '20px', 'var(--dale-gray-medium)')}>{k}</span>
      <span style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <span style={monFont(strong ? 600 : 500, 14, '20px', 'var(--dale-black)')}>{v}</span>
        {note && <span style={monFont(400, 12, '16px', 'var(--dale-gray-medium)')}>{note}</span>}
      </span>
    </div>
  );
}

function PreviewPanel({ preview, onClose, onOpenCustomers }) {
  if (!preview) return null;
  const { kind, data } = preview;
  const title = kind === 'customer' ? 'Customer' : kind === 'business' ? (data.kind === 'Agent' ? 'Agent Network' : 'Merchant') : 'PIN';
  return (
    <aside style={{ position: 'fixed', top: 16, right: 476, bottom: 16, width: 340, zIndex: 41, background: 'var(--dale-white)', borderRadius: 20, boxShadow: 'var(--shadow-flyout)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--dale-border-cool)' }}>
        <span style={monFont(600, 12, '100%', 'var(--dale-gray-medium)')}>{title.toUpperCase()} PREVIEW</span>
        <button type="button" aria-label="Close preview" onClick={onClose} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: 'var(--dale-gray-hard)', display: 'flex' }}><Icon name="Close" size={20} /></button>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
        {kind === 'customer' && (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={monFont(700, 22, '28px', 'var(--dale-black)')}>{data.name}</span>
              <span style={monFont(400, 14, '20px', 'var(--dale-gray-medium)')}>{data.phone}</span>
            </div>
            <div>
              <KV k="KYC" v={data.kyc} />
              <KV k="Wallet balance" v={fmtMoney(data.balance) + ' DOP'} />
              <KV k="Customer since" v={new Date(data.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
            </div>
            <span style={monFont(400, 13, '20px', 'var(--dale-gray-medium)')}>Full customer profile — not designed yet.</span>
          </React.Fragment>
        )}
        {kind === 'business' && (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={monFont(700, 22, '28px', 'var(--dale-black)')}>{data.name}</span>
              <span style={monFont(400, 14, '20px', 'var(--dale-gray-medium)')}>{data.kind} · {data.city}</span>
            </div>
            <div><KV k="Status" v={data.status} /><KV k="Aggregator" v="Midas" /></div>
            <span style={monFont(400, 13, '20px', 'var(--dale-gray-medium)')}>Full profile lives in {data.kind === 'Agent' ? 'Agent Network' : 'Merchants'} — not designed yet.</span>
          </React.Fragment>
        )}
        {kind === 'pin' && (
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ ...monFont(700, 22, '28px', 'var(--dale-black)'), letterSpacing: '0.08em' }}>{data.code}</span>
              <span style={monFont(400, 14, '20px', 'var(--dale-gray-medium)')}>Masked — confirm the last two characters with the caller.</span>
            </div>
            <div>
              <KV k="Status" v={data.status} />
              <KV k="Remaining amount" v={fmtMoney(data.remaining_amount) + ' DOP'} />
              <KV k="Due at" v={fmtDateLong(data.due_at)} />
            </div>
            <span style={monFont(400, 13, '20px', 'var(--dale-gray-medium)')}>Full record lives in PIN Management — not designed yet.</span>
          </React.Fragment>
        )}
      </div>
    </aside>
  );
}

function CancelDialog({ tx, onClose, onConfirm }) {
  const [reason, setReason] = React.useState(null);
  const [note, setNote] = React.useState('');
  const ok = reason && (reason !== 'Other' || note.trim().length >= 5);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'color-mix(in oklch, var(--dale-dark) 40%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()}>
        <Dialog title="Cancel this transaction?" style={{ width: 420 }}
          supportingText={`Reference ${tx.short_reference} · ${fmtMoney(tx.amount)} DOP. The PIN is voided and the customer is notified. This can't be undone.`}
          actions={<React.Fragment>
            <Button variant="standard" onClick={onClose}>Keep</Button>
            <Button variant="error" disabled={!ok} onClick={() => onConfirm(reason === 'Other' ? note.trim() : reason)}>Cancel transaction</Button>
          </React.Fragment>}>
          <div role="radiogroup" aria-label="Reason" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={monFont(700, 12, '100%', 'var(--text-on-brand)')}>Reason (required)</span>
            {CANCEL_REASONS.map((r) => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 0', ...monFont(400, 14, '20px', 'var(--text-on-brand)') }}>
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} style={{ accentColor: 'var(--dale-dark)', width: 16, height: 16, margin: 0 }} />{r}
              </label>
            ))}
            {reason === 'Other' && (
              <textarea autoFocus value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe the reason (min. 5 characters)" rows={2}
                style={{ resize: 'none', borderRadius: 8, border: '1px solid var(--dale-dark)', padding: '10px 12px', background: 'var(--dale-white)', ...monFont(400, 14, '20px', 'var(--gray-900)'), outline: 'none' }} />
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

function TransactionDrawer({ tx, data, onClose, onCancelled, onOpenCustomers }) {
  const [preview, setPreview] = React.useState(null);
  const [confirming, setConfirming] = React.useState(false);
  React.useEffect(() => { setPreview(null); setConfirming(false); }, [tx && tx.id]);
  if (!tx) return null;
  const customer = data.customers.find((c) => c.id === tx.customer_id);
  const biz = data.businesses.find((b) => b.id === tx.business_id);
  const canCancel = tx.status === 'Pending' && (tx.type === 'Cash-Out' || tx.type === 'P2P');
  const Chev = <Icon name="VuesaxOutlineArrowRight2" size={16} style={{ color: 'var(--dale-gray-light)' }} />;
  const Party = ({ label, value, sub, onClick, empty }) => (
    <button type="button" disabled={!onClick} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '12px 0', border: 0, borderBottom: '1px solid var(--dale-border-cool)', background: 'none', cursor: onClick ? 'pointer' : 'default' }}>
      <span style={{ ...monFont(400, 14, '20px', 'var(--dale-gray-medium)'), width: 88, flexShrink: 0 }}>{label}</span>
      <span style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={monFont(empty ? 400 : 500, 14, '20px', empty ? 'var(--dale-gray-medium)' : 'var(--dale-black)')}>{value}</span>
        {sub && <span style={monFont(400, 12, '16px', 'var(--dale-gray-medium)')}>{sub}</span>}
      </span>
      {onClick && Chev}
    </button>
  );
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 39, background: 'color-mix(in oklch, var(--dale-dark) 18%, transparent)' }} />
      <PreviewPanel preview={preview} onClose={() => setPreview(null)} onOpenCustomers={onOpenCustomers} />
      <aside role="dialog" aria-label="Transaction detail" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, zIndex: 40, background: 'var(--dale-white)', boxShadow: 'var(--shadow-flyout)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 32px 20px', display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--dale-border-cool)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={monFont(600, 12, '100%', 'var(--dale-gray-medium)')}>{tx.type.toUpperCase()} · REF</span>
            <button type="button" aria-label="Close" onClick={onClose} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: 'var(--dale-gray-hard)', display: 'flex' }}><Icon name="Close" size={22} /></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ ...monFont(800, 28, '100%', 'var(--dale-black)'), letterSpacing: '0.04em' }}>{tx.short_reference.replace(/(\d{4})(\d{4})/, '$1 $2')}</span>
            <StatusPill status={tx.status} size="default" />
          </div>
          <span style={monFont(700, 22, '28px', 'var(--dale-black)')}>{fmtMoney(tx.amount)} <span style={monFont(400, 16, '28px', 'var(--dale-gray-medium)')}>DOP</span></span>
        </div>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {tx.cancelled && (
            <div style={{ borderRadius: 8, padding: '12px 16px', background: 'var(--dale-sensitive)', ...monFont(400, 13, '20px', 'var(--dale-gray-hard)') }}>
              {tx.cancelled.by === 'system' ? 'Cancelled by the system' : 'Cancelled by you'} · {tx.cancelled.reason}
            </div>
          )}
          <DrawerSection title="Amounts">
            <KV k="Amount" v={fmtMoney(tx.amount) + ' DOP'} />
            <KV k="Business fee" v={fmtMoney(tx.business_fee) + ' DOP'} />
            <KV k="Aggregator fee" v={fmtMoney(tx.aggregator_fee) + ' DOP'} />
            {tx.platform_fee != null && <KV k="Platform fee" v={fmtMoney(tx.platform_fee) + ' DOP'} note="10% · cash-out only, absorbed by platform" />}
            <KV k="Owed amount" v={fmtMoney(tx.owed_amount) + ' DOP'} strong note="Business fee + aggregator fee" />
            {tx.payout_amount != null && <KV k="Payout amount" v={fmtMoney(tx.payout_amount) + ' DOP'} strong note={tx.platform_fee != null ? 'Amount − platform fee' : undefined} />}
          </DrawerSection>
          <DrawerSection title="Parties">
            <Party label="Customer" value={customer.name} sub={customer.phone} onClick={() => setPreview({ kind: 'customer', data: customer })} />
            {biz
              ? <Party label="Business" value={biz.name} sub={`${biz.kind} · ${biz.city}`} onClick={() => setPreview({ kind: 'business', data: biz })} />
              : <Party label="Business" value="None — P2P" sub="P2P transfers have no business attached" empty />}
            <Party label="PIN" value={tx.pin_code} sub={`${tx.pin.status} · due ${fmtDate(tx.pin.due_at)}`} onClick={() => setPreview({ kind: 'pin', data: { ...tx.pin, code: tx.pin_code } })} />
          </DrawerSection>
          <DrawerSection title="Record">
            <KV k="Short reference" v={tx.short_reference} />
            <KV k="Currency" v={tx.currency} />
            <KV k="Created at" v={fmtDateLong(tx.created_at)} />
            <KV k="Transaction ID" v={<span style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: 13 }}>{tx.id}</span>} />
          </DrawerSection>
        </div>
        {canCancel && (
          <div style={{ padding: '16px 32px 24px', borderTop: '1px solid var(--dale-border-cool)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span style={monFont(400, 13, '18px', 'var(--dale-gray-medium)')}>Pending {tx.type.toLowerCase()} — can still be cancelled.</span>
            <Button variant="error" onClick={() => setConfirming(true)}>Cancel</Button>
          </div>
        )}
      </aside>
      {confirming && <CancelDialog tx={tx} onClose={() => setConfirming(false)} onConfirm={(reason) => { setConfirming(false); onCancelled(tx.id, reason); }} />}
    </React.Fragment>
  );
}

export { TransactionDrawer };
