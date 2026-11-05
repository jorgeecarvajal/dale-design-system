import React from 'react';
import { Button, InputBoxWithUnit, InputField, NavigationBar, Switch } from '@dale/ui';
import { AdminHeader, ContentCard, DashboardBody } from './AdminChrome.jsx';

/* Config — Hi-Res "Config > PIN" (125:18864), "Config > Verification" (132:19440),
   "Config > Notifications" (132:19605). The frames carry the Aggregators tab labels
   (Home / Edit Profile / Bank Accounts) as leftovers; the kit names the tabs after
   the three frames instead. */

const CFG_TABS = ['PIN', 'Verification', 'Notifications'];
const CFG_DEFAULTS = {
  pinExpiry: '30', pinCap: '5', inactivity: '180',
  cashInOtp: true, organicOtp: false, sms: true,
};

function SettingRow({ label, checked, onChange }) {
  return (
    <div style={{ height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: 14, lineHeight: '100%', whiteSpace: 'nowrap', color: 'var(--ui-ink-800)' }}>{label}</span>
      <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
}

function ConfigScreen({ query, onQuery }) {
  const [tab, setTab] = React.useState(0);
  const [saved, setSaved] = React.useState(CFG_DEFAULTS);
  const [v, setV] = React.useState(CFG_DEFAULTS);
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }));
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);
  const num = (k) => (e) => set(k)(e.target.value.replace(/[^0-9]/g, ''));

  return (
    <React.Fragment>
      <AdminHeader title="Config" avatar="var(--dale-gray-medium)" query={query} onQuery={onQuery} />
      <DashboardBody>
        <ContentCard style={{ padding: '37px 32px' }}>
          <NavigationBar tabs={CFG_TABS} active={tab} onChange={setTab} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 8px 8px', boxSizing: 'border-box', alignSelf: 'stretch' }}>
            <div style={{ height: 37, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, lineHeight: '100%', whiteSpace: 'nowrap', color: 'var(--dale-gray-hard)' }}>Configuration</span>
              <Button variant="standard" icon={null} disabled={!dirty} onClick={() => setSaved(v)}>{dirty ? 'Save Configuration' : 'Saved'}</Button>
            </div>
            <div style={{ display: 'flex', padding: 10, boxSizing: 'border-box', alignSelf: 'stretch' }}>
              <div style={{ width: 505, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: tab === 0 ? 24 : 16 }}>
                {tab === 0 && <React.Fragment>
                  <InputBoxWithUnit label="PIN Expiry Period" unit="days" fieldWidth={450} value={v.pinExpiry} onChange={num('pinExpiry')} />
                  <InputField label="PIN Cap per Customer" value={v.pinCap} onChange={num('pinCap')} style={{ minWidth: 450, width: 505, maxWidth: '100%' }} />
                  <InputBoxWithUnit label="Balance Inactivity Period" unit="days" fieldWidth={450} value={v.inactivity} onChange={num('inactivity')} />
                </React.Fragment>}
                {tab === 1 && <React.Fragment>
                  <SettingRow label="Cash-in OTP required" checked={v.cashInOtp} onChange={set('cashInOtp')} />
                  <SettingRow label="Organic Balance convert OTP required" checked={v.organicOtp} onChange={set('organicOtp')} />
                </React.Fragment>}
                {tab === 2 && <SettingRow label="SMS notifications" checked={v.sms} onChange={set('sms')} />}
              </div>
            </div>
          </div>
        </ContentCard>
      </DashboardBody>
    </React.Fragment>
  );
}

export { ConfigScreen };
