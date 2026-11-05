import { MonitoringData } from './monitoring-data.js';

/* Reconciliation › Periods sample data. Adds July + August 2026 ledger rows (same fee rules as
   monitoring-data.js) and the Period entities: month × aggregator, Open | Closed.
   July is closed by Miguel Toirac; August is open with 3 blocking exceptions; September is the
   month in progress. Only Cash-In / Cash-Out count toward a period. Pending older than the threshold (System Parameters, 72 h here) = exception. */
(() => {
  const D = MonitoringData;
  let seed = 31;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const make = (type, status, created) => {
    const amount = Math.round((100 + rnd() * 4900) / 50) * 50;
    const biz = type === 'P2P' ? null : (rnd() < 0.8 ? D.businesses[0] : pick(D.businesses.slice(1)));
    const aggregatorFee = type === 'P2P' ? 0 : +(amount * 0.02).toFixed(2);
    const platformFee = type === 'Cash-Out' ? +(amount * 0.10).toFixed(2) : null;
    const pinHead = String(1000 + Math.floor(rnd() * 8999));
    const pinTail = String.fromCharCode(65 + Math.floor(rnd() * 26)) + Math.floor(rnd() * 10);
    return {
      id: 'tx_r' + Math.floor(rnd() * 1e9).toString(36), short_reference: String(10000000 + Math.floor(rnd() * 89999999)),
      type, status, currency: 'DOP', customer_id: pick(D.customers).id, business_id: biz ? biz.id : null,
      ...(type === 'Balance Convert' ? { direction: 'out', initiated_by: 'customer' } : {}),
      amount, business_fee: 0, aggregator_fee: aggregatorFee, platform_fee: platformFee, owed_amount: aggregatorFee,
      payout_amount: type === 'Cash-Out' ? +(amount - platformFee).toFixed(2) : type === 'P2P' ? amount : null,
      pin_code: '****' + pinTail, pin_full: pinHead + pinTail,
      pin: { remaining_amount: status === 'Completed' ? 0 : amount, status: status === 'Completed' ? 'Redeemed' : status === 'Pending' ? 'Active' : 'Void', due_at: new Date(created.getTime() + 72 * 3600e3) },
      created_at: created,
    };
  };
  const month = (y, m, n, pendingDays) => {
    const days = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < n; i++) {
      const r = rnd();
      const status = r < 0.86 ? 'Completed' : r < 0.94 ? 'Failed' : 'Cancelled';
      D.transactions.push(make(pick(D.TYPES), status, new Date(y, m, 1 + Math.floor(rnd() * days), 8 + Math.floor(rnd() * 12), Math.floor(rnd() * 60))));
    }
    pendingDays.forEach((d, k) => D.transactions.push(make('Cash-Out', 'Pending', new Date(y, m, d, 17, 20 + k * 9))));
  };
  month(2026, 6, 64, []);
  month(2026, 7, 72, [27, 29, 30]);
  // Cash-In auto-cancel: a Cash-In still pending 1 h after creation is closed by the system as Cancelled,
  // so it never reaches the 72 h exception threshold.
  D.transactions.forEach((t) => {
    if (t.type === 'Cash-In' && t.status === 'Pending' && D.NOW - t.created_at > 3600e3) {
      t.status = 'Cancelled'; t.cancelled = { reason: 'Auto-cancelled · unresolved after 1 h', by: 'system' }; t.pin = { ...t.pin, status: 'Void' };
    }
  });
  D.transactions.sort((a, b) => b.created_at - a.created_at);

  D.RECON = {
    threshold_h: 72,
    cashin_autocancel_h: 1,
    periods: [
      { id: '2026-09', y: 2026, m: 8, aggregator: 'Midas', status: 'Open' },
      { id: '2026-08', y: 2026, m: 7, aggregator: 'Midas', status: 'Open' },
      { id: '2026-07', y: 2026, m: 6, aggregator: 'Midas', status: 'Closed', closed_at: new Date('2026-08-03T10:14:00'), closed_by: 'Miguel Toirac' },
    ],
  };
})();
