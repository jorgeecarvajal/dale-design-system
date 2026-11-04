A 1px full-width rule for separating rows and sections.

```jsx
<Divider />
<Divider tone="var(--dale-divider)" />
```

Notable:
- Stretches to its container — it has no width of its own.
- Defaults to `--dale-border-cool` (#E6EFF5), the hairline the admin screens use, not the source's Material #CAC4D0.
- For the dark sidebar use `tone="var(--border-on-dark)"`.
