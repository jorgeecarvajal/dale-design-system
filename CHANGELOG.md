# Changelog

## 0.1.0

First release, from the Dale Design System (Figma `Dale_Mockup_20260919` RevD–RevF).

- 32 React components: actions, brand, data, feedback, forms, icons, layout, navigation.
- 109 colour tokens (light, plus the Figma Variables' dark mode), spacing, radii,
  shadows, layout sizes, 16 type styles, Gilroy 300/800.
- Tailwind v4 theme and v3 preset generated from `tokens/tokens.json`.
- Agent rules for consuming apps in `templates/`.
- Radius and line-height tokens are named `radius-dale-*` and `leading-dale-*`
  (`radius-lg` → `radius-dale-lg`, `leading-tight` → `leading-dale-tight`) so they
  don't overwrite Tailwind's own `--radius-lg` and `--leading-tight`. The build fails
  if a future token reuses one of Tailwind's variable names.
