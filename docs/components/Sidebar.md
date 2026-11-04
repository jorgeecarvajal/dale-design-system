One-line: the whole Dale admin left rail — drop it in as the first child of a full-height flex row.

```jsx
<div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-app)' }}>
  <Sidebar active="aggregators" onSelect={setSection} />
  <main style={{ flexGrow: 1 }}>…</main>
</div>
```

Notable:
- Section order is fixed by the source: Dashboard, Operations, Merchants, Agent Network, Aggregators, Reconciliation, Settlements, Pricing, Monitoring, Access.
- The active row renders in the `hover` state (yellow + rail); Aggregators additionally opens its flyout.
- 24px gap between the logo block and the item stack, 8px between rows, 20px top/bottom padding.
