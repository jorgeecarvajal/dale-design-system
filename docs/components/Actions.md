Table toolbar with Delete, Filters, Export and a primary action — use it at the top-right of a data table (Tables uses it automatically).

```jsx
<Actions onFilter={toggleFilters} onExport={exportCsv} />
<Actions onDelete={del} onFilter={f} onExport={e} onPrimary={add} primaryLabel="Nueva ubicación" />
```

Notable:
- Each button renders only when its handler is passed. *Operations › Transactions* shows only Filters + Export.
- Export is the only outlined button; Delete and Filters are ghost.
- The primary uses `Button variant="continue"` (green, `#4A4459` label).
