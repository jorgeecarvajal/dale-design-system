Data table card with header actions, row selection, status badges and pagination — use it for any list screen (locations, merchants, settlements).

```jsx
<Tables
  title="Locations" description="Puntos activos de la red"
  columns={[{key:'name',label:'Nombre',bold:true},{key:'city',label:'Ciudad'},{key:'status',label:'Estado',type:'status'}]}
  rows={[{name:'Colmado Doña Rosa',city:'Santo Domingo',status:'Active'}]}
  onFilter={openFilters} onExport={exportCsv} onAdd={newLocation} addLabel="Nueva ubicación"
  page={page} pageCount={4} onPageChange={setPage}
/>
```

Notable:
- The header block (title / description / actions) is optional — omit all of them to save vertical space.
- Footer: `resultCount` on the left, `pageSizeOptions` + `onPageSizeChange` for a "Show N" picker, then pagination (long ranges collapse to 1 … n).
- Header actions appear only when their handler is passed.
- `type: 'status'` → green dot badge for Active/Activo, grey for anything else.
- Selection is internal; `onDelete` receives the selected row indexes.
- Header icons are Lucide substitutes (source Untitled UI glyphs didn't extract).
