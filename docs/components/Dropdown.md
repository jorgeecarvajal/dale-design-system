Single-select dropdown with a bold 12px label — use it for picking one value from a short fixed list (country, currency, status).

```jsx
<Dropdown label="Country" options={['Dominican Republic','El Salvador','Nicaragua']} onChange={setCountry} />
<Dropdown label="Country" defaultOpen />
```

Notable:
- Label is Inter **700/12**, unlike `InputField`'s 16px label — that is the source.
- Trigger is 44px tall (InputField is 40px).
- Uncontrolled by default; pass `value`/`open` to control.
