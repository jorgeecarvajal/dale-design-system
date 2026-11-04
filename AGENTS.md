# AGENTS.md — working on the Dale Design System package (`@dale/ui`)

This repository *is* the design system. Apps consume it as a package; their rules
for using it are in `templates/` (copy those into each app).

## Layout

- `tokens/tokens.json` — the single source for every token. Edit tokens only here.
- `scripts/build-tokens.mjs` — generates `styles/tokens.css`, `tailwind/theme.css`
  and `tailwind/preset.cjs` from it. Never edit those three by hand; run `npm run tokens`.
- `styles/base.css` — what tokens.json cannot hold (easing, durations, Figma Variable
  modes, body and link defaults). Hand-written.
- `src/` — React components, one folder per family. Inline styles that read CSS
  variables (`var(--surface-card)`); no CSS classes, no Tailwind classes inside components.
- `types/index.d.ts` — public props for every component. Update it with any prop change.
- `docs/components/<Name>.md` — usage notes; first sentence is the summary.
- `docs/BRAND.md` — the brand book (colour, type, spacing, iconography, copy rules).

## Rules

- Values come from the Figma source and stay exact: 37px stays 37px, 5px stays 5px.
  Never snap to a grid or to Tailwind defaults.
- Every colour in a component is a `var(--token)` that exists in tokens.json. No hex.
- The inventory is the one in `docs/BRAND.md` → Components. Don't add components
  (Toast, Avatar, Badge…) unless the design adds them.
- Tailwind names must only ADD utilities. Never redefine one of Tailwind's own names
  (that is why radii are `dale-*` and palette-like Figma colours are `fig-*`).
- Any change to tokens, props or behaviour: bump the version (semver) and add a
  line to `CHANGELOG.md`.

## Commands

- `npm run tokens` — regenerate token outputs
- `npm run build` — tokens + library build into `dist/`
