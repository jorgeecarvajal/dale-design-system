import { MonitoringData } from './monitoring-data.js';

/* Customers for Operations › Customers — extends MonitoringData (load after monitoring-data.js).
   Adds profile fields, a PIN inventory per customer (GET /admin/pins?customer_id=), balances,
   and the Balance Convert direction / initiated_by fields (section 06 backend request). */
(() => {
  const D = MonitoringData;
  const NOW = D.NOW;
  let seed = 41;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.floor(rnd() * 16); return (c === 'x' ? r : (r & 3) | 8).toString(16); });
  const day = 864e5;

  const extra = [
    ['Wanda', 'Castillo', '809-555-0124'], ['Ramón', 'Peralta', '829-555-0147'], ['Altagracia', 'Mejía', '849-555-0163'],
    ['Juan Carlos', 'Guzmán', '809-555-0191'], ['Rosanna', 'Vásquez', '829-555-0102'], ['Héctor', 'Tavárez', '809-555-0138'],
    ['Miguelina', 'Ureña', '849-555-0176'], ['Fausto', 'Almonte', '829-555-0114'], ['Dahiana', 'Polanco', '809-555-0159'],
    ['Nelson', 'Encarnación', '849-555-0128'], ['Keila', 'Rosario', '829-555-0182'], ['Darío', 'Jiménez', '809-555-0197'],
  ];
  extra.forEach(([fn, ln, ph], i) => D.customers.push({ id: 'c' + (9 + i), name: fn + ' ' + ln, phone: ph, kyc: i % 4 === 2 ? 'Pending' : 'Verified', balance: i % 3 === 0 ? 0 : Math.round(rnd() * 3000), joined: new Date(NOW.getTime() - (20 + rnd() * 300) * day).toISOString().slice(0, 10) }));

  const STATUS = { c6: 'Suspended', c14: 'Cancelled' };
  const EMAIL = (n) => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.') + '@gmail.com';
  D.customers.forEach((c, i) => {
    const [first, ...rest] = c.name.split(' ');
    c.first_name = c.name.startsWith('Juan Carlos') ? 'Juan Carlos' : first;
    c.last_name = c.name.slice(c.first_name.length + 1);
    c.customer_id = uuid();
    c.country = 'Dominican Republic';
    c.phone_verified = c.kyc === 'Verified';
    c.status = STATUS[c.id] || 'Active';
    c.email = i % 3 === 1 ? '' : EMAIL(c.name);
    c.metadata = i === 0 ? '{"channel":"whatsapp","preferred_agent":"Farmacias GBC"}' : '';
    c.created_at = new Date(c.joined + 'T10:15:00');
    c.updated_at = new Date(Math.min(NOW.getTime(), c.created_at.getTime() + rnd() * 60 * day));
    c.unassigned_balance = c.balance;
  });

  // PIN inventory — every status, not just active.
  const pins = [];
  const code = () => String(1000 + Math.floor(rnd() * 8999)) + String.fromCharCode(65 + Math.floor(rnd() * 26)) + Math.floor(rnd() * 10);
  D.customers.forEach((c, ci) => {
    const n = ci < 8 ? 6 + Math.floor(rnd() * 7) : Math.floor(rnd() * 4);
    for (let k = 0; k < n; k++) {
      const r = rnd();
      const status = r < 0.3 ? 'Active' : r < 0.55 ? 'Expired' : r < 0.9 ? 'Redeemed' : 'Merged';
      const created = new Date(NOW.getTime() - (status === 'Active' ? rnd() * 2.5 : 3 + rnd() * 90) * day);
      const amount = Math.round((100 + rnd() * 4900) / 50) * 50;
      const full = code();
      pins.push({ id: 'pin_' + uuid().slice(0, 8), customer_id: c.id, code_full: full, code: '****' + full.slice(-2), amount,
        remaining_amount: status === 'Active' ? (rnd() < 0.3 ? Math.round(amount * 0.4 / 50) * 50 : amount) : 0,
        status, created_at: created, due_at: new Date(created.getTime() + 3 * day), merged_result: false });
    }
  });

  // Expired PINs flow to Unassigned Balance: one system Balance Convert (in) row each.
  pins.filter((p) => p.status === 'Expired').forEach((p) => {
    D.transactions.push({ id: 'tx_exp_' + p.id.slice(4), short_reference: String(10000000 + Math.floor(rnd() * 89999999)), type: 'Balance Convert',
      direction: 'in', initiated_by: 'system', status: 'Completed', currency: 'DOP', customer_id: p.customer_id, business_id: null,
      amount: p.amount, business_fee: 0, aggregator_fee: 0, platform_fee: null, owed_amount: 0, payout_amount: null,
      pin_code: p.code, pin_full: p.code_full, pin: { remaining_amount: 0, status: 'Expired', due_at: p.due_at }, created_at: p.due_at });
  });
  D.transactions.forEach((t) => { if (t.type === 'Balance Convert' && !t.direction) { t.direction = 'out'; t.initiated_by = 'customer'; } });
  D.transactions.sort((a, b) => b.created_at - a.created_at);

  D.pins = pins;
  D.PIN_STATUSES = ['Active', 'Expired', 'Redeemed', 'Merged'];
  D.CUSTOMER_STATUSES = ['Active', 'Suspended', 'Cancelled'];
  D.COUNTRIES = ['Dominican Republic'];
  D.balances = (id) => {
    const c = D.customers.find((x) => x.id === id);
    const pin = pins.filter((p) => p.customer_id === id && p.status === 'Active').reduce((s, p) => s + p.remaining_amount, 0);
    return { pin, unassigned: c.unassigned_balance, total: pin + c.unassigned_balance };
  };
  D.uuid = uuid;
})();
