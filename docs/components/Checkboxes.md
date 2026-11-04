A checkbox for admin forms and table row selection — 18px box in a 40px hit area, accent red when on.

```jsx
<Checkboxes checked={sel} onChange={e => setSel(e.target.checked)} label="Incluir inactivos" />
<Checkboxes indeterminate label="Seleccionar todo" />
<Checkboxes disabled checked label="Bloqueado" />
```

Notable:
- The source only ever paints this accent red (`#ED3237`); `tone` exists for the rare non-destructive case, but red is the default because that is what the file shows.
- `error` forces the red rule even when unselected.
- Disabled drops the whole control to 38%, matching the source's disabled treatment.
- Type is Inter (`--font-ui`), not the M3 original's Roboto — see readme.
