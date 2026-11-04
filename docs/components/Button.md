The Dale button — a pill whose ground colour names its role.

```jsx
<Button>Continuar</Button>                                  {/* dale — yellow + chevrons */}
<Button variant="standard">Guardar</Button>                 {/* yellow, no icon */}
<Button variant="error">Cancelar lote</Button>               {/* rojo + ✕ */}
<Button variant="continue">Continuar</Button>               {/* verde + chevron-right */}
<Button variant="secondary">Volver</Button>                 {/* celeste */}
<Button disabled>Continuar</Button>
```

| variant | ground | label | icon |
| --- | --- | --- | --- |
| `dale` | `--dale-yellow` | `--text-on-brand-strong` | trailing red chevrons |
| `standard` | `--dale-yellow` | `--text-on-brand-strong` | none |
| `error` | `--dale-accent-deep` #ED3438 | `--dale-sensitive-warm` | ✕ (`Close`) |
| `continue` | `--dale-green-contrast` | `--text-on-brand-strong` | chevron-right |
| `secondary` | `--dale-sky` | `--text-on-brand-strong` | none |

Notable:
- **`dale` is the signature button** — Gilroy ExtraBold with the brand chevrons. Reach for it as the primary forward action.
- `error` and `continue` are 40px tall; `dale`, `standard` and `secondary` are 37px. That difference is in the file.
- The error button's icon is the ✕ (`Close`). The minus-in-a-circle drawn on the
  Figma board is not in the file's exported icon set; ✕ is the confirmed stand-in.
- `continue` and `secondary` carry the dark `#4A4459` label, not the source's
  `#F5F6F6` — white on those grounds lands near 2:1. `error` keeps `#F5F6F6`
  (~4.4:1 on #ED3438).
- `tone` overrides the ground when you need an off-palette case; the label ink follows the variant.
- Type on the four non-`dale` variants is Inter (`--font-ui`), not the source's Roboto — no Roboto ships with this system.
