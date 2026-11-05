# Dale Admin — reference implementation

The admin screens recreated from the Hi-Res frames of `Dale_Mockup_20260919` (RevF/RevG),
built **only** with `@dale/ui`: its components, tokens and the Tailwind setup from the
package README. Use it as the worked example of how a Dale screen is put together.

**Figma is the source of truth.** Where this example and the Figma frame differ, follow
Figma. The known differences are listed under "Deviations from the source" below.

## Run it

```bash
# from the repository root, once:
npm install && npm run build
# then:
cd examples/admin
npm install
npm run dev
```

Sections are addressable by hash: `/#dashboard`, `/#operations`, `/#agent-network`…
The data is seeded and fake (`src/data/`), shaped like the admin API responses.

## Screens and their Figma frames

All paths are under `src/`.

Priority frames in `Dale-Admin-Mockup` and where each one is recreated:

| Frame | Node | File |
| --- | --- | --- |
| Dashboard | 9:299 | `screens/DashboardScreen.jsx` (+ `AdminChrome.jsx` for the header) |
| App shell / Sidebar | 176:24332 | `App.jsx` + the `Sidebar` component of `@dale/ui` |
| Operations › Transactions | 159:21149 | `screens/OperationsScreen.jsx` |
| Operations › Transactions › Details | 183:26468, 189:29629 | `screens/TransactionDrawer.jsx` |
| Operations › Transactions › Details – Parties | 189:28583 | `screens/TransactionDrawer.jsx` (parties preview) |

Every file:

| File | What it is | Source node |
| --- | --- | --- |
| `App.jsx` | The shell: sidebar + screen router | — |
| `screens/AdminChrome.jsx` | `AdminHeader`, `ContentCard`, `Tabs`, `DashboardBody` | 9:299 / 18:5312 |
| `screens/DashboardScreen.jsx` | "Dashboard" — rebuilt from the RevG frame | `Hi-Res/Dashboard` (9:299, RevG) |
| `screens/BusinessScreens.jsx` | Agent Network + Aggregators: Home · Edit Profile · Bank Accounts (+ Edit) · Fees · Locations (+ Detail, Agent Network only) | `Hi-Res/Agent-Network-*`, `Hi-Res/Aggregators-*` (RevG) |
| `screens/PricingScreen.jsx` | Country Pricing list + Edit Platform Pricing | `Hi-Res/Pricing-Platform*` (141:20476, 146:20879) |
| `screens/ConfigScreen.jsx` | Config: PIN · Verification · Notifications | `Hi-Res/Config-*` (125:18864, 132:19440, 132:19605) |
| `screens/OperationsScreen.jsx` | Operations › Transactions ledger | `Hi-Res/Operations-Transactions` (159:21149) |
| `screens/TransactionDrawer.jsx` | Row detail drawer, parties preview, cancel flow | `Hi-Res/Operations-Transactions-Details*` |
| `screens/MonitoringParts.jsx` | Formatters, filter fields, `StatusPill` (→ `Chips`) | — |
| `data/monitoring-data.js` | Seeded fake ledger shaped like `GET /admin/pin-transactions` | — |
| `data/customers-data.js` | Customer profiles, PIN inventory, Balance Convert direction/initiated_by | — |
| `screens/CustomersParts.jsx` | Status/verified chips, balance strip, status + merge dialogs, New Customer drawer | — |
| `screens/CustomersScreen.jsx` | Customers list + profile (Profile · PINs · Activity) | — (no Figma frame yet) |
| `screens/PlaceholderScreen.jsx` | Honest blank for undesigned sections | — |

## Operations › Transactions

- **Filter bar:** Reference · PIN · Customer · Business · Type · Status · From/To.
  It defaults to the last 24 h, and the ↻ icon inside *To* resets it.
- **Table header:** "N results" on the left; `Actions` with **Filters** and
  **Export** on the right.
  - **Filters** shows or hides the filter bar, to free up vertical space.
  - **Export** downloads a CSV of exactly the filtered set.
- **Status column** uses `Chips` (small size, for dense rows).
- **Footer:** "Show 25 / 50 / 100 / 250 rows" plus pagination. Only the table body scrolls.
- **Row detail** opens a right-hand drawer. Customer, Business and PIN links open
  a side preview. Cancel is only shown for Pending Cash-Out and P2P, and it asks
  for a reason.
- **Sample fees:** business 0%, aggregator 2% (0% on P2P), platform 10% (Cash-Out
  only). Owed = business + aggregator; payout = amount − platform fee. 80% of
  business rows are Farmacias GBC.

## Operations › Customers

No Figma frame yet — built from the product spec, with DS components only.

- **Header tabs** Transactions · Customers sit inline in the page header (no extra row).
- **Dashboard (RevG frame 9:299):** title "Dashboard"; outlined 28px range pills (active = dark
  fill); 4 KPI cards (radius 12, 1px `#E8EAED` hairline, blue `#2563EB` "View"); then two
  columns — Transactions by status + PINs by status | Customers + Avg. volume per active customer.
  RevG drops the "Pending backend" tiles and the Reconciliation/Settlement note, so they are gone.
  The Avg. card's grey "Proxy Note" box is empty in the frame; the kit fills it with the proxy caveat.
- **List:** search by phone/name, Status, Phone verified; **+ New Customer** in the table toolbar.
- **Profile header (always visible):** name, phone + Verified/Unverified, one **Status** dropdown
  (Active/Suspended → `PATCH …/status`, Cancelled → `DELETE`, each with a confirm), country,
  customer since, copyable Customer ID, balance strip (PIN · Unassigned · Total), **Edit Profile**
  (becomes Cancel / Save while editing).
- **Profile tab:** First/Last name, Email, Metadata (4,000 chars) editable; Phone, Country,
  Phone verified, Updated at read-only.
- **PINs tab:** status counts double as filters; select 2+ Active PINs → **Merge** (sources become
  Merged, one new Active PIN is created — confirmed); **Resend code** only on a merged-result PIN.
- **Activity tab:** the Transactions ledger pre-filtered by `customer_id`, with Type/Status/date
  filters only and no default date range. Balance Convert shows an IN/OUT tag; system expiries
  are marked "expiry".
- **New Customer:** one-step drawer; duplicate phone is blocked inline; phone stays unverified.

Open backend items: `POST /admin/customers` (and whether it rejects duplicate phones), and
`type: balance_convert` + `direction` / `initiated_by` — without it Activity can't show expiries.

## Deviations from the source

- **RevG placeholders cleaned up:** several RevG frames still carry leftovers — Aggregators tab labels
  (Home / Edit Profile / Bank Accounts) on Config and Pricing, "Label" buttons with the M3 star, open
  dropdowns overlapping fields. The kit names tabs after the frames (Config: PIN · Verification ·
  Notifications; Pricing: no tabs) and labels buttons by action (Save Configuration, Cancel / Save Changes).
- **Aggregators reuse the Agent Network screens** minus Locations and the Aggregator Channel picker;
  RevG's Aggregators frames match them field for field except those two.
- **Locations Detail field labels** are generic "Input Field" instances in the file; the kit labels them
  Location ID / Name, Address, Address Reference, City, Region, Coordinates, Contact Email / Phone.
- **Aggregators tab labels:** the source draws them in `#1814F3`, which isn't in
  the Dale palette. The kit uses `--dale-tab-active` (`#201E1E`) instead.
- **`Chips` colours:** the source dot `#6750A4` and the Pending label `#F5F7FA`
  are replaced with palette values (see `docs/components/Chips.md`).
- **Toolbar icons:** `trash-01`, `filter-lines` and `download-cloud-02` had no
  usable geometry in the file, so the equivalent `Table*` icons are used.
