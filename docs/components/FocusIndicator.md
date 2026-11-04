The focus ring the source's interactive components use — a 3px ring outside the element, for keyboard focus.

```jsx
<span style={{ position: 'relative', display: 'inline-flex' }}>
  <Button>Continuar</Button>
  {focused && <FocusIndicator radius={100} />}
</span>
```

Notable:
- Absolutely positioned — the host needs `position: relative`.
- Match `radius` to the host: `100` on a pill button, `2` on a checkbox.
- The source draws it at 3px in the scheme's secondary; here it defaults to `--dale-dark`, which reads on both the yellow pill and white surfaces.
