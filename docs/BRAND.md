# Dale Design System

**Dale** is a financial-inclusion platform for unbanked people: value moves through
**PINs** rather than bank rails, so someone without an account can still pay, receive
and cash out. *Dale* is Spanish for "go ahead / go for it" — the brand is built on
that push forward.

This system is extracted from one source, **`Dale-Admin Mockup.fig`**, attached to
this project as a mounted Figma file. It covers the **Dale Admin** back-office: the
operator console where staff watch operations, merchants, the agent network,
aggregators, reconciliation, settlements, pricing, monitoring and access.

There is no marketing site, mobile app, or deck in the source — the admin console is
the only product surface it defines, so it is the only UI kit here.

## Sources

- **Figma file:** `Dale_Mockup_20260919_RevD.fig` (mounted read-only; no shared
  URL was provided) — the current source. Earlier revisions `Dale-Admin
  Mockup.fig` and `Dale_Mockup_20260919_RevB.fig` were also imported; RevD adds
  the named button components. Pages: `Design-system` (Brand, Colors,
  Typography, Icons, Buttons, Input Field, Sidebar, sidebar-buttons) and `Hi-Res`
  (Dashboard `9:299`, Aggregators `18:5312`).
- No codebase, repository or deck was provided.

---

## Content fundamentals

The file contains very little written copy, so this is short by necessity — it
describes what is actually there, not an invented voice.

- **Language of the artefact is English**, even though the product serves a
  Spanish-speaking market. Labels are plain product nouns: *Overview, Operations,
  Merchants, Agent Network, Aggregators, Reconciliation, Settlements, Pricing,
  Monitoring, Access, Bank Accounts, Integrations, Edit Profile.*
- **Title Case for navigation and tabs** (`Agent Network`, `Bank Accounts`).
  Sentence case for field labels and helper text (`Label`, `Description`, `Error`).
- **No sentences in chrome.** Nothing in the shell is a sentence; the only
  sentence-shaped string in the whole file is the search placeholder,
  *"Search for something"* — lowercase after the first word, no period, no "…".
- **Nouns, not verbs, for sections.** A section is named for the thing it manages
  (*Settlements*), never for the action (*Settle payments*).
- **Second person is never used.** There is no "your account", no "we". The console
  addresses no one; it just names things.
- **No emoji. No exclamation marks. No sentence-ending punctuation in UI labels.**
- **Vibe:** operational and unfussy — a control room, not a consumer app. The brand
  personality (yellow, chevrons, the word *dale*) lives entirely in the logo and the
  active-state colour; the copy stays flat and factual.

Write new copy the same way: short noun phrases, Title Case for navigation,
sentence case for form text, no persuasion inside the console.

---

## Visual foundations

### Colour

Yellow `#FEE600` is the only loud colour and it is used **sparingly** — logo pill,
the active navigation row, the 6px active rail, the flyout bullets. Everything else
is a near-monochrome scaffold of dark `#201E1E`, greys, and the `#F5F7FA` canvas.
Red `#ED3237` is reserved for the chevrons and the notification dot.

| Role | Token | Value |
| --- | --- | --- |
| Brand / active | `--dale-yellow` | `#FEE600` (labelled `FFE600` in the Figma swatch) |
| Sidebar & flyout ground | `--dale-dark` | `#201E1E` |
| Heading ink | `--dale-black` | `#212121` |
| Accent / alert | `--dale-accent` | `#ED3237` |
| Body ink | `--dale-gray-hard` | `#4D4D4D` |
| Secondary ink | `--dale-gray-medium` | `#717171` |
| Idle nav & placeholders | `--dale-gray-light` | `#89939E` |
| Cool neutral | `--dale-gray-blue` | `#ABBED1` |
| App canvas | `--dale-silver` | `#F5F7FA` |
| Quiet fill | `--dale-sensitive` | `#F5F5F5` |
| Positive | `--dale-green-contrast` / `--dale-contrast` | `#41D4A8` / `#32F09E` |

Semantic aliases (`--surface-app`, `--surface-sidebar`, `--nav-active`,
`--text-body`, `--accent-danger`, …) are declared in `tokens/tokens.json`; use those
in product code.

**One contrast caveat:** idle nav (`#89939E` on `#201E1E`) and the search
placeholder (`#89939E` on `#F5F7FA`) both sit near 4.1:1. That is what the file
specifies; raise to `--dale-gray-blue` or white if you need AA on small text.

### Type

Three families, all used:

- **Gilroy ExtraBold / Light** — the primary brand face ("1th Gilroy"),
  `--font-display`. Real binaries ship in `fonts/`; only the two weights
  the Figma file uses (800 and 300) were supplied.
- **Montserrat Bold / Regular / Light** — the documented secondary face ("2nd
  Montserrat"), `--font-secondary`.
- **Inter 300–800** — the entire product UI. Everything inside the admin console is
  Inter; the brand faces never appear in-product.

Brand scale (Typography frame): 32 / 24 / 16 for Large, Medium, Small Title;
16px Regular for Body and Caption. Product scale (Hi-Res frames): 28/800 page title,
18/800 active nav, 18/500 idle nav, 16/700 flyout title, 16/400 field, 15/300 search,
13 and 12 for meta. Headings run at `line-height: 100%`; field text at 1.4.

The file publishes **zero** Figma text styles — the scale is documented as plain
text layers only. It is reproduced as tokens in `tokens/tokens.json` and as
convenience classes (`.dale-page-title`, …) in `styles/tokens.css`.

### Spacing & layout

Dale is **not on an 8px grid**. Real values: 8, 10, 12, 16, 20, 24, **30, 37, 40**.
Copy them literally — 37px is the content-card vertical padding and it matters.

Fixed layout frame: 250px sidebar → 100px header → 40px body gutters → a 20px-radius
white content card with 37/30 padding. Sidebar rows are 50×250 with 40px side
padding and a 20px icon-to-label gap; the logo container is 70px tall.

### Corners

`5` (sidebar hit area) · `8` (input, brand swatch) · `12` (flyout sub-item) ·
`16` (flyout) · `18.1667` (app-icon squircle) · `20` (content card) ·
`40` (search pill) · `50%` (avatar, notification button). The active nav rail uses
the asymmetric `20px 10px 10px 20px`.

### Cards, borders, shadows

Cards are **flat**: white, 20px radius, no border, no shadow — separation comes from
the `#F5F7FA` canvas. Chrome is delineated by 1px hairlines (`#E6EFF5` for the
header/panel, `#F4F5F7` for the tab rule, `#D9D9D9` for input borders).

There is exactly **one real drop shadow in the entire file**: the sidebar flyout,
`0px 12px 28px rgba(0,0,0,0.149)` with a `1px #2B2A2A` inset ring. Do not add more.

### States & motion

- **Idle → active nav** is a *colour + weight + rail* change, never a background
  fill: `#89939E`/Inter 500 → `#FEE600`/Inter 800 plus the 6px yellow rail.
- Flyout sub-items use an 8% yellow wash (`rgba(254,230,0,0.0784)`) at 12px radius.
- The source defines **no pressed, focus, or disabled state** outside `InputField`
  (which has Default / Error / Disabled). Don't invent them; if you must, darken
  rather than lighten and keep the geometry fixed.
- **No animation is specified anywhere in the file.** If you need motion, keep it
  minimal — `--duration-base: 180ms` with `--ease-standard` is the house default
  added here, and nothing should bounce.

### Transparency, blur, imagery

No blur, no gradients, no glass. The only transparency in the system is the 8%
yellow flyout wash and the app-icon inset rings. **The file contains no photography
or illustration** — five JPEGs are referenced but none appear in a design frame. The
brand's only ornament is the three-chevron mark.

---

## Iconography

- **Vuesax (outline + linear)** is the icon library shipped in the file — 120 glyphs
  extracted verbatim into `src/icons/icon-data.js` and rendered through
  `<Icon name="…" />`. Three sub-families: people/profile/user (linear), arrows and
  transfer (outline), messaging/SMS (outline). All single-colour, painted with
  `currentColor`, drawn on a 35.455 square box.
- **Sidebar glyphs come from a different, mixed set** — the designer pulled one
  Iconify glyph per section from `iconoir`, `eva`, `boxicons`, `keyline-icons`,
  `akar-icons`, `material-symbols-light` and `fluent-mdl2`. Those ten (plus the
  collapse control) are extracted as vector data into
  `src/icons/nav-icon-data.js` and rendered through the same `<Icon>`
  component under a `Nav` prefix — `<Icon name="NavAggregators" size={20} />`.
  They are 20×20 in the sidebar.
- Header search and bell are extracted as standalone SVGs
  (`assets/icons/search-icon.svg`, `notification-icon.svg`) and tinted with a CSS
  mask so they take the current ink colour.
- **No icon font, no sprite sheet, no emoji, no unicode glyphs used as icons.**
- Stroke icons only — nothing filled except the brand chevrons.

### Brand assets

- `assets/dale-logo.svg` — the primary lockup (yellow pill, dark wordmark, three red
  chevrons), extracted verbatim from the `dale Logo` component. Approved on three
  grounds: yellow `#FEE600`, black `#010101`, off-white `#F7FAFC`. **Never recolour it.**
- `assets/dale-chevrons.svg` (+ `-black`, `-yellow`, `-red`, `-white`) — the
  three-chevron mark used for the app icon and as the sole ornament.

---

## Index

Where each part lives in this package:

| Path | What |
| --- | --- |
| `tokens/tokens.json` | The single source for every token |
| `styles/tokens.css` | Generated CSS custom properties, type classes, Gilroy `@font-face` |
| `styles/base.css` | Easing, durations, Figma Variable modes, `body` and link defaults |
| `tailwind/theme.css`, `tailwind/preset.cjs` | Generated Tailwind v4 theme and v3 preset |
| `fonts/`, `assets/` | Gilroy webfonts; logo, chevron marks, header icons |
| `src/` | Component sources (React) |
| `types/index.d.ts` | Props for every component |
| `docs/components/` | Usage notes per component |

### Components

**Brand** — `DaleLogo`, `FavIcon`
**Icons** — `Icon`
**Navigation** — `SidebarItem`, `DashboardItem`, `OperationsItem`, `MerchantsItem`,
`AgentNetworkItem`, `AggregatorsItem`, `ReconciliationItem`, `SettlementsItem`,
`PricingItem`, `MonitoringItem`, `AccessItem`, `Sidebar`, `NavigationBar`
**Forms** — `InputField`, `InputBoxWithUnit`, `Dropdown`, `Checkboxes`, `Switch`
**Feedback** — `Dialog` (aliased `XRXRDialog`), `FocusIndicator`
**Layout** — `Divider` (`variant` full-width / middle-inset; aliased `HorizontalFullWidth`, `HorizontalMiddleInset`)
**Actions** — `Button`, `Actions` (table toolbar)
**Data** — `Tables`, `Chips` (transaction status)

That is the whole inventory the source defines as Dale designs. There is no Badge,
Table, Modal, Toast, Tabs or Avatar component in the Figma file, and none has been
invented here.

#### The button family (RevD)

`Dale_Mockup_20260919_RevD.fig` promotes the Buttons board's rows into named
components: `Button - standard` (`32:8844`) plus `Button standard`,
`Button error`, `Button continue` and `Button secondary` (`36:14177–9`). All five
ship as one `Button` with a `variant` prop.

| variant | source | ground | label | icon | height |
| --- | --- | --- | --- | --- | --- |
| `dale` | `Button - standard` `32:8844` | yellow `#FEE600` | `#4A4459` | trailing red chevrons | 37 |
| `standard` | `Button standard` | yellow `#FEE600` | `#4A4459` | — | 37 |
| `error` | `Button error` `36:14177` | red `#ED3438` | `#F5F6F6` | leading ✕ | 40 |
| `continue` | `Button continue` `36:14178` | green `#41D4A8` | `#4A4459` | leading chevron-right | 40 |
| `secondary` | `Button secondary` `36:14179` | sky `#69CDEF` | `#4A4459` | — | 37 |

Shared: radius 100, 10/16 padding, 8px gap, 800/14 type.

**The ground colour is what names the role** — and all three accent grounds are
existing Dale tokens (`--dale-accent-deep`, `--dale-green-contrast`,
`--dale-sky`), which confirms the variation is intentional rather than leftover
Material. `#ED3438` is the exact error red, confirmed by the designer — note it
is the *deep* accent, not the `#ED3237` used by the brand chevrons.

*Extraction note:* `fig_materialize` flattens the nested override list on these
instances and returns the yellow base fill for all four, so the JSX alone reads
as "all identical". The rendered board is the truth here — the colours above were
read from it.

Two deliberate deviations:
- **Type is Inter, not Roboto.** No Roboto face ships with this system and no
  other Dale surface uses it.
- **The `error` button's icon is the ✕ (`Close`).** The minus-in-a-circle drawn
  on the board is not in the file's exported icon set; ✕ is the designer-confirmed
  stand-in.

**Contrast, fixed on the designer's call:** the source sets `#F5F6F6` on all
three coloured grounds, which lands near 1.9:1 on `#41D4A8` and 2.0:1 on
`#69CDEF` — illegible. `continue` and `secondary` therefore carry the dark
`#4A4459` label (`--text-on-brand-strong`) instead. `error` keeps `#F5F6F6`,
which reaches about 4.4:1 on `#ED3438` and passes.

`Input Field` is unchanged through RevB and RevD — the shipped `InputField`
already matches it value for value.

### Intentional additions

- **`SidebarItem`** — the ten section families are geometrically identical in the
  source; this is their shared base, exposed because building an eleventh nav
  section otherwise means copy-pasting a family.
- **`NavIcon`** — *removed.* The ten sidebar glyphs and the collapse control were
  folded into `Icon` under a `Nav` prefix (`NavDashboard`, `NavSidebarCollapse`, …)
  so the system exposes one icon component rather than two. They exist in
  `Dale-Admin Mockup.fig` as loose vectors inside each nav item, not as components.
- **`Tabs` / `AdminHeader` / `ContentCard`** (UI-kit-local, not exported) — the
  Aggregators and Dashboard frames draw these inline; they are factored out inside
  the design system's `ui_kits/dale-admin/` only (not shipped in this package).
- **`Dialog`** — *confirmed intentional name.* Kit set `XR/XR Dialog`; the `XR`
  (Material extended-reality) prefix is dropped from the public API. The literal
  kit name is also exported as the alias `XRXRDialog`.
- **`Divider`** — *confirmed intentional name.* One component for the two kit
  rules `Horizontal/Full-width` and `Horizontal/Middle-inset` (via `variant`),
  so consumers pick a rule, not a symbol path. Both kit names are exported as
  aliases: `HorizontalFullWidth`, `HorizontalMiddleInset`.

### RevF changes (Dale_Mockup_20260919_RevF.fig)

- **`Chips`** — new status chip set (Completed / Pending / Cancelled / Failed).
  Two source values replaced to stay in palette: the `#6750A4` M3 purple dot →
  solid status colour; the Pending label `#F5F7FA` (invisible) → `#717171`.
- **Sidebar** — the `Monitoring Item` family now renders **Config** with the M3
  `settings` gear, placed last. The component keeps its Figma name
  (`MonitoringItem`); the sidebar key is `config`.
- **`Actions`** — new table toolbar (Delete · Filters · Export · primary); `Tables` now renders its header through it.
- **`Tables`** — with no title, the result count moves into the header, left of
  Filters / Export (as in *Operations › Transactions*).
- **Icons** — `TableCopy` / `TableCheck` added as stand-ins (the kit has no copy glyph), same 2px stroke as the other `Table*` icons.
- **Icons** — `Add`, `ChevronForward`, `DoNotDisturbOn`, `Reply`, `Settings`
  added. `trash-01`, `filter-lines` and `download-cloud-02` had no decodable
  geometry; the existing `TableTrash` / `TableFilter` / `TableDownload` stand in.

### Coverage — 32 of 41 kit families, 9 skipped on purpose

RevG's checker counts 41 families (one more than RevF) without adding a Dale design: the new Hi-Res frames only reuse the existing families. The extra count comes from the frame-local symbols that RevG frames promote (legend items, filter cells, table cells). These are screen fragments, so the UI kit builds them inline rather than shipping them as components.

RevF adds `Chips` and `Actions` (both built) and `Shape Set` — 35 M3 shape masks whose only use is the chip's circle dot, drawn in CSS. Not built, same reason as the other M3 library sets below.

| Skipped | Why |
| --- | --- |
| `Button - text` (50 variants) | Raw Material 3 matrix. Dale's buttons derive from it and ship as `Button` variants. |
| `Button - tonal` (50 variants) | Same, the tonal M3 matrix. |
| `logo/dashboard` | Third-party library placeholder (teal gradient + flower, empty vectors) — not Dale artwork; building it would redraw another brand's mark. |
| `stars_filled`, `check`, `close`, `check_small`, `check_indeterminate_small`, `mobile_check` | Glyph symbols, not components — shipped as `Icon` names (`StarsFilled`, `Check`, `Close`, …). |
| `Focus indicator` internals / `Type=Round…` / `State=Enabled` M3 building blocks | Private M3 sub-symbols already absorbed into `FocusIndicator`, `Button`, `Checkboxes`, `Switch`. |
| `settings`, `trash-01`, `filter-lines`, `download-cloud-02` | Icon symbols with no decodable geometry in the file; `trash`/`filter`/`download` ship as Lucide substitutes in `Icon` (`Table*`). |

The checker counts every symbol in the file, library payload included, so it
will keep reporting 30 / 37. This table is the confirmation it asks for.

### Not built — and why

`/METADATA.md` for **RevE** counts **18 component sets** plus standalone symbols. Sixteen sets are built:

> the ten `‹Section› Item` families → `DashboardItem` … `AccessItem`;
> `Button - standard` → `Button`; `Input Field` → `InputField`;
> `Checkboxes` → `Checkboxes`; `Switch` → `Switch`; `XR/XR Dialog` → `Dialog`;
> `Navigation Bar` (Cantidad 3–6) → `NavigationBar`.

Plus standalone symbols: `Focus indicator` → `FocusIndicator`;
`Horizontal/Full-width` and `Horizontal/Middle-inset` → `Divider`;
and, new in RevE, `Dropdown` (+ `Option`) → `Dropdown` and
`Input box with unit` → `InputBoxWithUnit`; `Tables` (88:461) → `Tables`.

**`Tables` colour mapping.** The source table is an Untitled-UI-style block:
#EAECF0 hairlines, #101828 / #667085 text, a purple `Secondary` action, #14BA6D
green CTA and badge. None are Dale swatches, so they map to `--dale-border-cool`,
`--dale-black` / `--dale-gray-medium`, `--dale-silver` header row, `--dale-sky`
checked rows (as drawn), `--dale-green-contrast` badge, and `Button
variant="continue"` for the CTA. **Its header/pagination icons (trash-01,
filter-lines, download-cloud-02, plus, arrow-down, dots, chevrons) did not
extract** — they ship as Lucide substitutes (`Table*` names in `Icon`). Export
those glyphs from Figma as SVG to replace them.

**RevE additions — notes.** `Navigation Bar / Pestaña` exists only in its
inactive state (Inter 400/16, #ABBED1). `NavigationBar`'s `active` prop reuses
the system's existing active-tab treatment so screens can mark the current
tab; omit it to match the file exactly. `Dropdown` is drawn open only; the
closed state is its trigger alone.

The two unbuilt sets are **`Button - text` (50 variants)** and **`Button - tonal`
(50 variants)** — the raw Material 3 button matrices. Dale's five buttons derive
from them and ship as `Button`'s variants, so publishing the M3 grids as well
would give consumers 100 components no Dale screen uses.

Earlier revisions carried a much larger Material 3 library payload — **48
families in RevB**, including eight dot-prefixed `.Building Blocks/…` internals
that are private in Figma. RevD trimmed that to 17. None of the RevB-only M3
families were built, for the same reason: Roboto type, `--schemes-*` M3 tokens
and M3 geometry with no Dale styling, so recreating them would publish Material
Design under Dale's name and hand consumers components no Dale screen uses. For
the record, that set was:

| Skipped set (RevB) | Why |
| --- | --- |
| `Button` (50), `Button - text` (50), `Button - tonal` (50) | The raw M3 button sets. Dale's five buttons derive from them and ship as `Button`'s variants; see above. |
| `Icon button - standard` (150), `Icon button togglable - standard` (300) | M3, unused in any Dale screen. |
| `FAB` (72) | M3. No Dale surface has a floating action button. |
| `App bar` (12), `Search bar` (6) | M3. The admin's own header is `AdminHeader` in the UI kit. |
| `Navigation Rail` (8), `Building Blocks/Navigation rail/Vertical nav item` (48) | M3. Dale's nav is the ten `‹Section› Item` families + `Sidebar`. |
| `Badges` (2), `Generic avatar` (3), `Linear-determinate progress indicator` (24) | M3, unplaced. |
| `Checkboxes` (30), `Switch` (20), `XR/XR Dialog` (4) | **Built** as `Checkboxes`, `Switch`, `Dialog` — see the note below. |
| The 8 `.Building Blocks/…` sets (App bar content, search bars, progress segments) | Dot-prefixed = private M3 internals, not consumable components. |

**Three M3 sets were adopted, not skipped — `Checkboxes`, `Switch`, `XR/XR Dialog`.**
These are the only M3 sets a Dale designer actually placed: they sit on the Input
Field board with brand colours painted over them. They ship as `Checkboxes`,
`Switch` and `Dialog`, built from the source's exact geometry with the
designer's own fills:

| Component | Geometry from | Dale fill applied in the source |
| --- | --- | --- |
| `Checkboxes` | `Checkboxes` `33:13380` — 40px hit area, 18px box, 2px radius, 2px rule | accent red `#ED3237` |
| `Switch` | `Switch` `33:13906` — 52×32 track, 16px thumb off / 24px on, 2/8 → 2/4 padding | sky `#69CDEF` |
| `Dialog` | `XR/XR Dialog` `33:13823` — 312px, radius 28, 24px padding, 24/32 headline, 14/20 body | yellow `#FEE600` ground |

Two deliberate deviations, both flagged: **type is Inter (`--font-ui`), not the
M3 original's Roboto** — no Dale surface uses Roboto and no Roboto face ships
with this system; and the **full M3 state matrices** (hovered / focused / pressed
ripples, the 30/20/4 variant grids) are **not** reproduced — only enabled,
selected and disabled, which is all the Dale boards show. If Dale wants its own
checkbox, switch or dialog design rather than a rebranded M3 one, design it and
I will rebuild against the real spec.

**One deliberate rename — `XR/XR Dialog` → `Dialog`.** `XR` is the Material
library's extended-reality namespace; it means nothing in a web back-office and
would be noise in every consumer's import. `Checkboxes` and `Switch` keep their
kit names verbatim. The component is **also exported as `XRXRDialog`**, the
kit's own set name flattened, so either import resolves to the same thing.

**Two more kit families built from RevD:**

| Component | Source | Note |
| --- | --- | --- |
| `FocusIndicator` | `Focus indicator` `32:8378` | 3px ring at 2px radius, drawn outside the host. The button, checkbox and switch families use it for focus. |
| `Divider` | `Horizontal/Full-width` `33:13550` | 1px full-width rule. Ships `--dale-border-cool` (#E6EFF5) rather than the source's Material #CAC4D0, which appears on no Dale surface. Also exported as `HorizontalFullWidth`. |

- **`logo/dashboard`** (`2:196`) — **deliberately not built.** It is a third-party
  library placeholder, not Dale artwork: a 60×60 squircle at radius 10 filled
  with a teal→green gradient (`#67E9F1` → `#24E795`) carrying a four-petal
  "Flower#3" mark. Neither colour is in the Dale palette, and every vector inside
  it extracts with empty geometry — so building it would mean inventing someone
  else's logo from scratch. The Brand frame uses it only as an app-icon backing
  plate with the inner artwork switched off. `FavIcon` (109px, radius 18.17,
  yellow, the real three-chevron mark) is what Dale actually uses and is already
  built. It is deliberately **not** aliased to `FavIcon`: different artwork at a
  different size, and a false alias would be worse than an honest gap.

---

## Caveats

1. **Gilroy ships only in ExtraBold (800) and Light (300)** — the two weights the
   Figma file uses. Anything asking for Gilroy Regular/Bold will synthesise.
   Send the other weights if you need them.
2. **Contrast:** idle nav and search placeholder land near 4.1:1, below AA for small
   text. Kept as-designed.
3. **Tab labels in the Aggregators frame are `#1814F3` blue** — a colour that
   belongs to no Dale swatch. Replaced with `--dale-tab-active` (`#201E1E`) so
   every colour in this system comes from the provided palette. Say the word if
   you want the source blue restored.
4. **The Dashboard frame has an empty body.** Only the header and sidebar are
   designed. Eight of the ten sidebar sections have no screen at all.
