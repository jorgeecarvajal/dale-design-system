/** Shared sample data, filled in by this file, customers-data.js and recon-data.js. */
export const MonitoringData = {};

/* Fake ledger for Operations › Monitoring — shaped like GET /admin/pin-transactions.
   Deterministic (seeded) so the prototype looks the same on every load. */
(() => {
  const NOW = new Date('2026-09-25T14:30:00');
  const customers = [
    { id: 'c1', name: 'María Pérez', phone: '809-555-0142', kyc: 'Verified', balance: 3420.5, joined: '2025-11-02' },
    { id: 'c2', name: 'José Rodríguez', phone: '829-555-0188', kyc: 'Verified', balance: 812.0, joined: '2026-01-19' },
    { id: 'c3', name: 'Ana Martínez', phone: '849-555-0107', kyc: 'Pending', balance: 150.0, joined: '2026-08-30' },
    { id: 'c4', name: 'Luis Fernández', phone: '809-555-0171', kyc: 'Verified', balance: 9875.25, joined: '2025-06-14' },
    { id: 'c5', name: 'Carmen Díaz', phone: '829-555-0133', kyc: 'Verified', balance: 2210.0, joined: '2026-03-08' },
    { id: 'c6', name: 'Pedro Santana', phone: '809-555-0165', kyc: 'Rejected', balance: 0, joined: '2026-09-01' },
    { id: 'c7', name: 'Yokasta Reyes', phone: '849-555-0119', kyc: 'Verified', balance: 540.75, joined: '2026-02-21' },
    { id: 'c8', name: 'Rafael Batista', phone: '829-555-0156', kyc: 'Verified', balance: 1300.0, joined: '2025-12-12' },
  ];
  const businesses = [
    { id: 'b0', name: 'Farmacias GBC', kind: 'Merchant', city: 'Santo Domingo', status: 'Active' },
    { id: 'b1', name: 'Colmado Doña Rosa', kind: 'Agent', city: 'Santo Domingo Este', status: 'Active' },
    { id: 'b2', name: 'Farmacia Carol Naco', kind: 'Merchant', city: 'Santo Domingo', status: 'Active' },
    { id: 'b3', name: 'Banca La Suerte', kind: 'Agent', city: 'Santiago', status: 'Active' },
    { id: 'b4', name: 'Supermercado Bravo', kind: 'Merchant', city: 'Santo Domingo', status: 'Active' },
    { id: 'b5', name: 'Colmado El Primo', kind: 'Agent', city: 'La Vega', status: 'Inactive' },
    { id: 'b6', name: 'Ferretería Ochoa', kind: 'Merchant', city: 'Santiago', status: 'Active' },
  ];
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const TYPES = ['Cash-In', 'Cash-Out', 'P2P', 'Balance Convert'];
  const tx = [];
  for (let i = 0; i < 140; i++) {
    const type = TYPES[Math.floor(rnd() * 4)];
    const r = rnd();
    const status = r < 0.62 ? 'Completed' : r < 0.82 ? 'Pending' : r < 0.93 ? 'Failed' : 'Cancelled';
    const hoursAgo = i < 112 ? rnd() * 23.5 : 24 + rnd() * 24 * 12;
    const created = new Date(NOW.getTime() - hoursAgo * 3600e3);
    const amount = Math.round((100 + rnd() * 4900) / 50) * 50; // max 5,000 DOP
    const biz = type === 'P2P' ? null : (rnd() < 0.8 ? businesses[0] : pick(businesses.slice(1))); // 80% Farmacias GBC
    // Platform absorbs costs: business 0%, aggregator 2%, platform 10% (cash-out only).
    // owed = business + aggregator fee; payout = amount − platform fee.
    const businessFee = 0;
    const aggregatorFee = type === 'P2P' ? 0 : +(amount * 0.02).toFixed(2);
    const platformFee = type === 'Cash-Out' ? +(amount * 0.10).toFixed(2) : null;
    const owed = +(businessFee + aggregatorFee).toFixed(2);
    const payout = type === 'Cash-Out' ? +(amount - platformFee).toFixed(2) : type === 'P2P' ? amount : null;
    const ref = String(10000000 + Math.floor(rnd() * 89999999));
    const pinHead = String(1000 + Math.floor(rnd() * 8999));
    const pinTail = String.fromCharCode(65 + Math.floor(rnd() * 26)) + Math.floor(rnd() * 10);
    tx.push({
      id: 'tx_' + (9120 + i).toString(36) + Math.floor(rnd() * 1e6).toString(36),
      short_reference: ref, type, status, currency: 'DOP',
      customer_id: pick(customers).id, business_id: biz ? biz.id : null,
      amount, business_fee: businessFee, aggregator_fee: aggregatorFee, platform_fee: platformFee,
      owed_amount: owed, payout_amount: payout, pin_code: '****' + pinTail, pin_full: pinHead + pinTail,
      pin: { remaining_amount: status === 'Completed' ? 0 : amount, status: status === 'Completed' ? 'Redeemed' : status === 'Pending' ? 'Active' : 'Void', due_at: new Date(created.getTime() + 72 * 3600e3) },
      created_at: created,
    });
  }
  tx.sort((a, b) => b.created_at - a.created_at);
  Object.assign(MonitoringData, { NOW, customers, businesses, transactions: tx, TYPES, STATUSES: ['Pending', 'Completed', 'Failed', 'Cancelled'] });
})();
