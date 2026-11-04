A modal card for confirmations and short decisions — yellow ground, 28px radius, headline plus supporting text and a right-aligned action row.

```jsx
<Dialog
  title="¿Liquidar el lote?"
  supportingText="Se enviarán 1,284 operaciones a liquidación. No se puede deshacer."
  actions={<><Button showChevrons={false}>Cancelar</Button><Button>Liquidar</Button></>}
/>
```

Notable:
- The yellow ground is the source's own override — the dialog is a brand moment, not a neutral card. Pass `surface` only when yellow fights the content.
- An `icon` centres the whole stack; without one the text is left-aligned. Override with `align`.
- The component renders no scrim and no buttons — compose `actions` from `Button`.
- Type is Inter (`--font-ui`), not the M3 original's Roboto — see readme.
