# Changelog

## 0.2.0

- `examples/admin/`: the admin screens recreated from the Figma Hi-Res frames with
  `@dale/ui` only (Dashboard, Operations › Transactions + details drawer, Agent Network,
  Aggregators, Reconciliation, Pricing, Config), as a runnable Vite app. Its `src/` and
  README ship in the package, at `node_modules/@dale/ui/examples/admin/`.
- Agent rules (`templates/`): read the Figma frame first (stop if Figma is not reachable),
  then the matching example screen; exact Figma values win over tokens.
- README: install from GitHub with a version tag; GitHub Packages scope explained.

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
