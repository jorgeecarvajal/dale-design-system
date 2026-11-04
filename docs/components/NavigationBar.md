Section tab strip for the top of a content card — use it to switch between sub-views of one entity (Home / Edit Profile / Bank Accounts / Fees…).

```jsx
<NavigationBar tabs={['Home','Edit Profile','Bank Accounts','Fees']} active={tab} onChange={setTab} />
```

Notable:
- `tabs.length` is the source's `Cantidad` axis (3–6 in the file).
- Fixed 120px tabs, 40px gap — long labels are not truncated; keep them short.
- The source defines no active state; `active` applies the system's active-tab ink + underline. Omit it to match the file exactly.
