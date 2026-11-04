One-line: Dale's single form primitive — a labelled 40px text field with default / error / disabled states.

```jsx
<InputField label="Aggregator name" value="Banco Pichincha" />
<InputField label="Tax ID" valueType="placeholder" value="Enter tax ID" />
<InputField label="Routing code" state="error" value="0012" error="Routing code must be 8 digits" />
<InputField label="Legacy ID" state="disabled" value="—" />
```

Notable:
- Geometry is exact and non-negotiable: 40px control height, 8px radius, 12px/16px padding, 8px gap between label, control and message. Minimum width 120px.
- Ink comes from the SDS token layer shipped in the file (`--text-default-default`, `--border-danger-default`, …), not from the Dale brand ramp — that is how the source is built.
- There is no icon slot, no size scale and no success state in the source. Do not add them.
