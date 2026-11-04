An on/off toggle for settings and filters — sky-blue track when on, with the thumb growing 16→24px.

```jsx
<Switch checked={live} onChange={e => setLive(e.target.checked)} label="Monitoreo en vivo" />
<Switch disabled label="Requiere permiso" />
```

Notable:
- Use for state that applies immediately. For state that needs a save action, use `Checkbox`.
- The track grows its thumb and shifts padding between states — that size change is in the source, not decoration.
- Disabled drops the whole control to 38%.
