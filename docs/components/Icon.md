One-line: the Vuesax glyph library shipped with the Dale admin file — 120 outline/linear glyphs that paint with `currentColor`.

```jsx
<Icon name="VuesaxOutlineArrowRight" size={20} style={{ color: 'var(--icon-default)' }} />
```

Notable:
- Three Vuesax sub-families by prefix: `VuesaxLinear…` (people/profile/user), `VuesaxOutline…Arrow/Import/Export/Refresh/Send…` (transfer + navigation), `VuesaxOutlineMessage…/Sms…/Direct…` (messaging).
- The ten sidebar glyphs plus the collapse control live in the same map under a `Nav` prefix: `NavDashboard`, `NavOperations`, `NavMerchants`, `NavAgentNetwork`, `NavAggregators`, `NavReconciliation`, `NavSettlements`, `NavPricing`, `NavMonitoring`, `NavAccess`, `NavSidebarCollapse`. They are drawn on a 20×20 box — that is the sidebar size.
- All glyphs are single-colour; recolor with the CSS `color` property, never a `fill` prop.
- Six Material-derived glyphs the form families rely on also live here: `Check`,
  `CheckSmall`, `CheckIndeterminateSmall`, `Close`, `MobileCheck`, `StarsFilled`.
- `iconNames` exports the full list — render it to browse. The same array hangs
  off the component as `Icon.names`, which is how `@dsCard` HTML reaches it.
