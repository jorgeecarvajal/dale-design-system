## UI: Dale Design System (`@dale/ui`)

All UI in this app uses the Dale Design System. Before writing any component or style, check it here.

- **Components first.** Use `@dale/ui` before building anything: `Button`, `Actions`, `Tables`, `Chips`, `InputField`, `InputBoxWithUnit`, `Dropdown`, `Checkboxes`, `Switch`, `Dialog`, `Divider`, `NavigationBar`, `Sidebar` (+ the ten `*Item` rows), `Icon`, `DaleLogo`, `FavIcon`, `FocusIndicator`. Props: `node_modules/@dale/ui/types/index.d.ts`. When and how: `node_modules/@dale/ui/docs/components/<Name>.md`.
- **Never restyle a component** to look like another variant. Pick the variant (`<Button variant="error">`). If none fits, say so rather than inventing one.
- **Colours only from tokens.** Tailwind: `bg-surface-app`, `bg-surface-card`, `text-text-body`, `text-text-heading`, `text-text-subtle`, `border-border-subtle`, `border-border-field`, `bg-dale-yellow`. CSS: `var(--surface-app)`. Never hex values and never Tailwind's default palette (`gray-500`, `blue-600`…). Prefer the semantic names (`surface-*`, `text-*`, `border-*`, `accent-*`, `nav-*`) over the raw ramp (`dale-*`).
- **Yellow is a signal, not a fill.** `dale-yellow` marks the active item, the logo and the primary button. Never use it as a page or card background.
- **Spacing is not an 8px grid.** Use the Dale steps: `dale-8`, `dale-10`, `dale-12`, `dale-16`, `dale-20`, `dale-24`, `dale-30`, `dale-37`, `dale-40` (e.g. `p-dale-37`, `gap-dale-30`). Content cards are `px-dale-30 py-dale-37`; page gutters `p-content-pad`.
- **Layout frame:** sidebar `w-sidebar-width` (250px, use `<Sidebar>`), header `h-header-height` (100px), white content card `bg-surface-card rounded-dale-lg` on the `bg-surface-app` canvas.
- **Corners:** `rounded-dale-sm` (inputs), `rounded-dale-md` (flyout), `rounded-dale-lg` (cards), `rounded-dale-pill` (search), `rounded-dale-round` (buttons, round controls).
- **Flat surfaces.** Cards have no border and no shadow. The only shadow is `shadow-flyout` (sidebar flyout). Hairlines are 1px `border-border-subtle`.
- **Type:** Inter for all product UI (`font-ui`, the default). Gilroy (`font-display`) only for brand moments. Sizes: `text-dale-page-title` (28/800), `text-dale-ui-nav-active`, `text-dale-body`, `text-dale-ui-meta`… or the plain classes `.dale-page-title`, `.dale-body`.
- **Icons:** `<Icon name="…" />` only (`iconNames` lists them). No other icon library, no emoji.
- **Copy:** short noun phrases, Title Case for navigation and tabs, sentence case for form labels, no exclamation marks.

Brand book: `node_modules/@dale/ui/docs/BRAND.md`. Token values: `node_modules/@dale/ui/tokens/tokens.json`.
