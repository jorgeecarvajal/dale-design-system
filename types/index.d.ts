import * as React from 'react';

// ---- AccessItem ----
/** Dale admin sidebar row for the Access section. */
export interface AccessItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Access". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const AccessItem: React.FC<AccessItemProps>;

// ---- Actions ----
/**
 * Table toolbar — the RevF `Actions` component (167:3576).
 * Delete and Filters sit flush as white ghost buttons, Export is outlined
 * (1px #D0D5DD), and the primary is `Button variant="continue"`. All 40px
 * tall, radius 8, 10/16 padding, 8px icon gap, Inter 500 14/20 in Gray Hard,
 * 16px between groups. `Tables` renders this in its header.
 */
export interface ActionsProps {
  onDelete?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
  /** Primary (continue-style) button. Renders only when passed. */
  onPrimary?: () => void;
  primaryLabel?: string;
  /** Icon name for the primary button. Default "Add". */
  primaryIcon?: string;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Actions: React.FC<ActionsProps>;

// ---- AgentNetworkItem ----
/** Dale admin sidebar row for the Agent Network section. */
export interface AgentNetworkItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Agent Network". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const AgentNetworkItem: React.FC<AgentNetworkItemProps>;

// ---- AggregatorsItem ----
/** Dale admin sidebar row for the Aggregators section. */
export interface AggregatorsItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Aggregators". */
  label?: string;
  /** Sub-menu shown in the flyout when state is "hover". Default [Profile,Bank Accounts,Integrations]. */
  flyout?: string[];
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const AggregatorsItem: React.FC<AggregatorsItemProps>;

// ---- Button ----
/**
 * The Dale button. Five variants from `Dale_Mockup_20260919_RevD.fig` — the
 * ground colour is what names the role:
 *
 * | variant | ground | label | icon |
 * | --- | --- | --- | --- |
 * | `dale` | yellow #FEE600 | #4A4459 | trailing red chevrons |
 * | `standard` | yellow #FEE600 | #4A4459 | none |
 * | `error` | red #ED3438 | #F5F6F6 | leading ✕ |
 * | `continue` | green #41D4A8 | #4A4459 | leading chevron-right |
 * | `secondary` | sky #69CDEF | #4A4459 | none |
 *
 * All share radius 100, 10/16 padding, 8px gap and 800/14 type. `error` and
 * `continue` are 40px tall; the other three are 37px.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'dale' | 'standard' | 'error' | 'continue' | 'secondary';
  /** Leading 20px glyph. Overrides the variant's default; pass `null` to drop it. */
  icon?: React.ReactNode;
  /** Override the variant's ground colour. */
  tone?: string;
  /** Source variant axis. "disabled" is equivalent to the disabled prop. */
  state?: 'enabled' | 'disabled';
  disabled?: boolean;
  /** Force the trailing chevrons on or off. Defaults to on for `dale`, off elsewhere. */
  showChevrons?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Button: React.FC<ButtonProps>;

// ---- Checkboxes ----
/**
 * Dale checkbox — 40px hit area, 18px box at 2px radius, 2px rule when
 * unselected, filled with the brand accent when selected. Geometry is the
 * source's `Checkboxes` set (node 33:13380); the accent red #ED3237 is the
 * fill the designer painted onto it on the Input Field board.
 */
export interface CheckboxesProps {
  checked?: boolean;
  /** Renders the dash glyph instead of the tick. */
  indeterminate?: boolean;
  disabled?: boolean;
  /** Draws the rule and fill in accent red regardless of tone. */
  error?: boolean;
  /** Fill colour when selected. Default `var(--dale-accent)`. */
  tone?: string;
  /** Optional text to the right of the box. */
  label?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Checkboxes: React.FC<CheckboxesProps>;

// ---- Chips ----
/**
 * Transaction status chip — the RevF `Chips` set (173:24137, 4 variants).
 * 25px pill at radius 100, 16px side padding, 8px gap, 10px dot,
 * Gilroy ExtraBold 14px label in Gray Medium on a 15% tint of the status colour.
 */
export interface ChipsProps {
  /** Source variant axis `Status`. */
  status?: 'Completed' | 'Pending' | 'Cancelled' | 'Failed';
  /** Override the label text. Defaults to the status name. */
  label?: React.ReactNode;
  /** `small` = 22px / 12px label, for dense tables. Not in the source. */
  size?: 'default' | 'small';
  style?: React.CSSProperties;
  className?: string;
}
export declare const Chips: React.FC<ChipsProps>;

// ---- DaleLogo ----
/**
 * The dale primary lockup — yellow pill (#FEE600), dark wordmark, three red
 * (#ED3237) chevrons. Self-coloured: it sits unchanged on yellow, black and
 * off-white grounds (the three approved backgrounds in the Brand frame).
 */
export interface DaleLogoProps {
  /** Rendered width in px; height follows the 287.558 × 95.677 aspect. Default 130 (the sidebar size). */
  width?: number;
  style?: React.CSSProperties;
  className?: string;
}
export declare const DaleLogo: React.FC<DaleLogoProps>;

// ---- DashboardItem ----
/** Dale admin sidebar row for the Dashboard section. */
export interface DashboardItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Dashboard". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const DashboardItem: React.FC<DashboardItemProps>;

// ---- Dialog ----
/**
 * Dale dialog — 312px wide (min 280, max 560), radius 28, 24px padding,
 * 16px stack gap, 24/32 headline, 14/20 supporting text at 0.25 letter-spacing,
 * action row at 24/24/24/8 with an 8px gap. Geometry is the source's
 * `XR/XR Dialog` set (node 33:13823); the #FEE600 yellow ground is the fill the
 * designer painted onto it on the Input Field board.
 *
 * Pass `actions` real `Button`s — the component does not supply them.
 */
export interface DialogProps {
  open?: boolean;
  title?: string;
  supportingText?: string;
  /** 24px glyph above the headline; its presence centres the stack by default. */
  icon?: React.ReactNode;
  /** Action row content, right-aligned. Usually one or two `Button`s. */
  actions?: React.ReactNode;
  /** Extra body content between the supporting text and the action row (form controls, lists). */
  children?: React.ReactNode;
  /** Override the automatic alignment (centre when an icon is present). */
  align?: 'start' | 'center';
  /** Card ground. Default `var(--dale-yellow)`. */
  surface?: string;
  onDismiss?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Dialog: React.FC<DialogProps>;
/** Alias under the kit's own set name (`XR/XR Dialog`). Same component. */
export declare const XRXRDialog: React.FC<DialogProps>;

// ---- Divider ----
/**
 * Hairline rule, two source variants:
 * - `full-width` — `Horizontal/Full-width` (33:13550), stretches edge to edge,
 *   shipped at `--dale-border-cool` (#E6EFF5), the hairline Dale surfaces use.
 * - `middle-inset` — `Horizontal/Middle-inset` (52:14388, new in RevE), 16px
 *   inset on both sides, 1px `--dale-outline-variant` (#CAC4D0). Used between
 *   sections of the content template and the Input Field board.
 */
export interface DividerProps {
  variant?: 'full-width' | 'middle-inset';
  /** Rule colour override. */
  tone?: string;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Divider: React.FC<DividerProps>;
/** Alias: `Horizontal/Full-width`. */
export declare const HorizontalFullWidth: React.FC<Omit<DividerProps, 'variant'>>;
/** Alias: `Horizontal/Middle-inset`. */
export declare const HorizontalMiddleInset: React.FC<Omit<DividerProps, 'variant'>>;

// ---- Dropdown ----
/**
 * Single-select dropdown — `Dropdown` (55:331, new in RevE) with its
 * `Option` rows (55:325).
 *
 * Label Inter 700/12 `--gray-900`; 44px trigger, radius 8, 1px `--gray-300`
 * border, 12/16 padding, Inter 16 value, 20px Vuesax arrow-down in
 * `--gray-500`. Open panel: same border/radius, 43px rows on
 * `--dale-sensitive-warm` (#F5F6F6).
 *
 * The source shows the open state only; the closed state is the trigger alone.
 * Selected-row emphasis (600 weight) is an addition — the file shows no selection.
 */
export interface DropdownProps {
  label?: string;
  options?: string[];
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  /** Compact variant for filter bars: 40px trigger, 14px text, 36px rows. */
  dense?: boolean;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Dropdown: React.FC<DropdownProps>;

// ---- FavIcon ----
/**
 * The dale app icon / favicon: an 18.1667px-radius squircle carrying the
 * three-chevron mark. Three approved combinations exist in the Brand frame:
 * yellow ground, black ground (with a dark inner ring), white ground (light ring).
 */
export interface FavIconProps {
  /** Square size in px. Default 109 (the Brand-frame specimen size). */
  size?: number;
  /** Squircle fill. Default `var(--dale-yellow)`. */
  background?: string;
  /** Chevron colour. Default `var(--dale-black-pure)`. */
  markColor?: string;
  /** Inner hairline ring used on the black and white variants. */
  ring?: 'dark' | 'light';
  style?: React.CSSProperties;
  className?: string;
}
export declare const FavIcon: React.FC<FavIconProps>;

// ---- FocusIndicator ----
/**
 * Focus ring — the source's `Focus indicator` (node 32:8378): a 3px ring at
 * 2px radius, drawn outside the element it marks. Used by the button,
 * checkbox and switch families in their focused states.
 *
 * Absolutely positioned: give the element it marks `position: relative`.
 */
export interface FocusIndicatorProps {
  /** Corner radius. Match the host's radius (100 for pills). Default 2. */
  radius?: number | string;
  /** Ring colour. Default `var(--dale-dark)`. */
  tone?: string;
  /** How far outside the host the ring sits, in px. Default -2. */
  inset?: number;
  style?: React.CSSProperties;
  className?: string;
}
export declare const FocusIndicator: React.FC<FocusIndicatorProps>;

// ---- Icon ----
/**
 * Every glyph in the Dale icon library: the Vuesax glyphs that ship in the
 * source file, the ten sidebar glyphs and the collapse control under a `Nav`
 * prefix (`NavDashboard`, `NavAggregators`, `NavSidebarCollapse`, …), and the
 * six Material-derived glyphs the form families use (`Check`, `CheckSmall`,
 * `CheckIndeterminateSmall`, `Close`, `MobileCheck`, `StarsFilled`).
 * Paints with currentColor.
 */
export interface IconProps {
  /** Glyph name, e.g. "VuesaxOutlineArrowRight" or "NavSettlements". See iconNames. */
  name: string;
  /** Rendered square size in px. Default 24. */
  size?: number;
  /** Accessible label. Omit for decorative icons. */
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Icon: React.FC<IconProps>;
/** Every valid `name` value. Also available as `Icon.names`, which is how
 *  `@dsCard` HTML reaches it (the bundle carries only capitalised exports). */
export declare const iconNames: string[];

// ---- InputBoxWithUnit ----
/**
 * `Input box with unit` (130:19421, new in RevE) — an `InputField` fixed at
 * 120px with a unit label beside it (10px gap, Inter 400/16 black, aligned to
 * the field's baseline with a 12px bottom offset). Used for fees, limits and
 * percentages on Pricing and Fees screens.
 *
 * All other props pass through to `InputField` (state, valueType, onChange…).
 */
export interface InputBoxWithUnitProps extends InputFieldProps {
  /** Unit text, e.g. "%", "USD", "días". Default "unit". */
  unit?: string;
  /** Field width in px. Default 120 (source). */
  fieldWidth?: number;
}
export declare const InputBoxWithUnit: React.FC<InputBoxWithUnitProps>;

// ---- InputField ----
/**
 * The Dale form field — the only form primitive the source defines.
 * 6 variants: State (Default | Error | Disabled) × Value Type (Default | Placeholder).
 * 40px control, 8px radius, 12/16 padding, Inter 400 16px, 8px stack gap.
 */
export interface InputFieldProps {
  state?: 'default' | 'error' | 'disabled';
  /** "default" = real value ink; "placeholder" = tertiary ink. */
  valueType?: 'default' | 'placeholder';
  label?: string;
  value?: string;
  /** Optional helper line under the label. */
  description?: string;
  /** Optional message under the control; renders in danger ink when state is "error". */
  error?: string;
  /** Hide the label row. Default true. */
  hasLabel?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const InputField: React.FC<InputFieldProps>;

// ---- MerchantsItem ----
/** Dale admin sidebar row for the Merchants section. */
export interface MerchantsItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Merchants". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const MerchantsItem: React.FC<MerchantsItemProps>;

// ---- MonitoringItem ----
/** Dale admin sidebar row for the Monitoring section. */
export interface MonitoringItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Monitoring". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const MonitoringItem: React.FC<MonitoringItemProps>;

// ---- NavigationBar ----
/**
 * Section tab strip — `Navigation Bar` (RevE, 5 variants on `Cantidad` = 3/4/5/6)
 * built from `Navigation Bar / Pestaña` (65:463). Sits at the top of the
 * content card on Aggregators, Agent Network, Pricing and Config screens.
 *
 * Tabs are 120×30, labels centred, Inter 400/16 in `--dale-gray-blue`
 * (#ABBED1), 40px apart, over a 1px `--dale-sensitive-warm` (#F5F6F6) base
 * line. `Cantidad` is just `tabs.length`.
 *
 * The source draws only the inactive state. `active` reuses the system's
 * existing active-tab treatment (`--dale-tab-active` label + 3px underline)
 * so screens can show where the user is — see readme.
 */
export interface NavigationBarProps {
  /** Tab labels. Length = the source's `Cantidad`. */
  tabs?: string[];
  /** Index of the current tab. Omit for the source's all-inactive rendering. */
  active?: number;
  onChange?: (index: number) => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const NavigationBar: React.FC<NavigationBarProps>;
/** Alias: `Navigation Bar / Pestaña` — a single tab. */
export declare const NavigationBarPestaA: React.FC<{ children?: string } & Omit<NavigationBarProps, 'tabs'>>;

// ---- OperationsItem ----
/** Dale admin sidebar row for the Operations section. */
export interface OperationsItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Operations". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const OperationsItem: React.FC<OperationsItemProps>;

// ---- PricingItem ----
/** Dale admin sidebar row for the Pricing section. */
export interface PricingItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Pricing". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const PricingItem: React.FC<PricingItemProps>;

// ---- ReconciliationItem ----
/** Dale admin sidebar row for the Reconciliation section. */
export interface ReconciliationItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Reconciliation". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const ReconciliationItem: React.FC<ReconciliationItemProps>;

// ---- SettlementsItem ----
/** Dale admin sidebar row for the Settlements section. */
export interface SettlementsItemProps {
  /** "default" (Gray Light, Inter 500) or "hover" (yellow, Inter 800, 6px rail). */
  state?: 'default' | 'hover';
  /** Override the row label. Default "Settlements". */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const SettlementsItem: React.FC<SettlementsItemProps>;

// ---- Sidebar ----
/**
 * The Dale admin sidebar — 250px dark (#201E1E) rail carrying the dale lockup,
 * a collapse control, and the ten navigation sections in source order.
 */
export interface SidebarProps {
  /** Active section key: dashboard | operations | merchants | agent-network | aggregators | reconciliation | settlements | pricing | monitoring | access */
  active?: string;
  /** Called with the section key when a row is clicked. */
  onSelect?: (key: string) => void;
  /** Controlled collapsed state (80px icon rail). Omit to let the sidebar manage it. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean;
  /** Called with the next collapsed state when the collapse control is clicked. */
  onCollapse?: (collapsed: boolean) => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Sidebar: React.FC<SidebarProps>;

// ---- SidebarItem ----
/**
 * Shared base for the ten Dale sidebar item families. Authored as one component
 * because all ten families are geometrically identical in the source and differ
 * only by glyph, label and (for Aggregators) a flyout. Prefer the named family
 * component (`DashboardItem`, `PricingItem`, …) in product code.
 */
export interface SidebarItemProps {
  /** NavIcon glyph name. */
  icon: string;
  label: string;
  /** "default" = Gray Light / Inter 500. "hover" = yellow / Inter 800 + 6px rail. */
  state?: 'default' | 'hover';
  /** Icon-only 80px row; label becomes a tooltip. */
  collapsed?: boolean;
  /** Sub-menu labels; renders the dark flyout panel when state is "hover". */
  flyout?: string[];
  /** Flyout heading; defaults to `label`. */
  flyoutTitle?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const SidebarItem: React.FC<SidebarItemProps>;

// ---- Switch ----
/**
 * Dale switch — 52×32 track at radius 100. Off: 16px thumb, 2px rule,
 * 2/8 padding. On: 24px white thumb, 2/4 padding, sky-blue track.
 * Geometry is the source's `Switch` set (node 33:13906); the sky blue
 * #69CDEF is the fill the designer painted onto it on the Input Field board.
 */
export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  /** Track colour when on. Default `var(--dale-sky)`. */
  tone?: string;
  /** Optional text to the right of the track. */
  label?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Switch: React.FC<SwitchProps>;

// ---- Tables ----
export interface TablesColumn {
  key: string;
  label: string;
  /** Inter 500 in `--dale-black` (the source's "Bold text column"). */
  bold?: boolean;
  /** `status` renders the Active / Inactive dot badge. */
  type?: 'text' | 'status';
  /** Show the sort arrow. Default true. */
  sortable?: boolean;
}

/**
 * Data table card — `Tables` (88:461, new in RevE), used on Agent Network ›
 * Locations. Card at radius 8 with a 1px hairline; header (Inter 500/18 title,
 * 400/14 description, optional Delete / Filters / Export / Add actions);
 * 44px rows with 12/24 cell padding; 66px checkbox column; 72px row-actions
 * column; pagination (Previous · 40px dark page chip at radius 10 · Next).
 *
 * Colours are mapped to the Dale palette: hairlines `--dale-border-cool`,
 * header row `--dale-silver`, checked rows `--dale-sky`, Active badge on
 * `--dale-green-contrast`, primary action = `Button variant="continue"`.
 *
 * @startingPoint section="Data" subtitle="Table card with selection, status badges and pagination" viewport="1100x520"
 */
export interface TablesProps {
  /** Header block renders only if title, description or an action is passed. */
  title?: string;
  description?: string;
  columns?: TablesColumn[];
  rows?: Record<string, React.ReactNode>[];
  /** Checkbox column with select-all. Default true. */
  selectable?: boolean;
  /** Kebab column. Pass a function to receive (row, index). Default true. */
  rowActions?: boolean | ((row: Record<string, React.ReactNode>, index: number) => void);
  /** Each header action renders only when its handler is passed. */
  onDelete?: (selectedIndexes: number[]) => void;
  onFilter?: () => void;
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  /** Total matching rows, shown at the left of the footer. */
  resultCount?: number;
  /** Fill the parent's height: rows scroll inside the card under a sticky header row; card header and footer stay put. */
  fillHeight?: boolean;
  /** Compact rows: 36px, 8/16 cell padding. For dense operational lists. */
  dense?: boolean;
  /** Extra footer content placed right after the result count (e.g. a reset link). */
  footerStart?: React.ReactNode;
  pageSize?: number;
  /** e.g. [25, 50, 100, 250] — renders a "Show N" picker in the footer. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  style?: React.CSSProperties;
  className?: string;
}
export declare const Tables: React.FC<TablesProps>;

// ---- aliases ----
export type XRXRDialogProps = DialogProps;
export type HorizontalFullWidthProps = Omit<DividerProps, 'variant'>;
export type HorizontalMiddleInsetProps = Omit<DividerProps, 'variant'>;
export type NavigationBarPestaAProps = { children?: string } & Omit<NavigationBarProps, 'tabs'>;
