A 120px InputField with a unit label to its right — use it for numeric settings that carry a unit (fees, limits, percentages, days).

```jsx
<InputBoxWithUnit label="Comisión" value="2.5" unit="%" />
<InputBoxWithUnit label="Límite" value="500" unit="USD" state="error" />
```

Notable:
- Accepts every `InputField` prop.
- Width is fixed at 120 by default; override with `fieldWidth` only for long values.
