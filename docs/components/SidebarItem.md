One-line: the generic Dale sidebar row — use the named family components instead unless you are building a nav section the product does not have.

```jsx
<SidebarItem icon="Aggregators" label="Aggregators" state="hover" flyout={['Profile','Bank Accounts','Integrations']} />
```

Notable:
- Two states only: `default` (Gray Light `#89939E`, Inter 500) and `hover` (yellow `#FEE600`, Inter 800, 6px rail with `20px 10px 10px 20px` radius). There is no pressed or disabled state in the source.
- Fixed 250×50 with 40px side padding and 20px icon/label gap — do not compress.
- The flyout is a 220px dark panel at `left: 250` with `16px` radius and the one real drop shadow in the system.
