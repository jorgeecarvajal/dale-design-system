Status chip for a transaction (Completed / Pending / Cancelled / Failed) — use it in the Status column of ledgers and in detail headers.

```jsx
<Chips status="Completed" />
<Chips status="Pending" />
<Chips status="Failed" size="small" />
```

Notable:
- Grounds are verbatim from RevF: 15% tints of `#41D4A8`, `#69CDEF`, `#89939E`, `#ED3438`-family red.
- Two source values were replaced to stay inside the Dale palette:
  - the dot was `#6750A4` (Material 3 purple) on all four; it now takes the solid status colour;
  - the Pending label was `#F5F7FA` (invisible on its light-blue tint); all labels use `--dale-gray-medium` `#717171`, as the other three variants already did.
- `size="small"` is an addition for 36px dense rows; the source only has the 25px chip.
