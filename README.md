# @dale/ui — Dale Design System

Tokens, componentes React y tema de Tailwind del admin de Dale. Es la fuente única:
la app lo instala como dependencia y los agentes (Cursor, Claude Code) leen sus reglas
y documentación desde aquí.

## Instalación

En la app (no en este repo), se instala directo desde GitHub, fijando una versión con su tag:

```bash
npm install github:jorgeecarvajal/dale-design-system#v0.2.0
```

npm descarga el repo y compila el paquete al instalarlo. En el código se importa como
`@dale/ui`, que es el nombre del `package.json`. Si el repo es privado, cada dev necesita
acceso a él con su cuenta de GitHub (en Windows lo resuelve Git Credential Manager).

`npm install @dale/ui` a secas **no** funciona: busca en el registro público de npm,
donde el paquete no está publicado.

Requiere React 18 o 19.

### Publicar una versión nueva

1. Sube `version` en `package.json` y anota el cambio en `CHANGELOG.md`.
2. `git commit`, luego `git tag v0.x.y`, `git push` y `git push origin v0.x.y`.
3. En la app: `npm install github:jorgeecarvajal/dale-design-system#v0.x.y`.

### Alternativa: GitHub Packages

Para instalarlo como `npm install @scope/ui` desde un registro privado, GitHub Packages
exige que el scope sea el dueño del repo: `@jorgeecarvajal/ui` mientras el repo esté en tu
cuenta, o `@dale/ui` si se mueve a una organización llamada `dale`. Habría que cambiar
`name` en `package.json` (y los imports de las apps) y usar el `.npmrc.example`.

## Uso con Vite + Tailwind v4

`src/index.css`:

```css
@import "tailwindcss";
@import "@dale/ui/styles.css";
@import "@dale/ui/tailwind/theme.css";
```

`index.html`, dentro de `<head>` (Inter y Montserrat; Gilroy ya viene en el paquete):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;700&display=swap">
```

En un componente:

```tsx
import { Sidebar, Button, Tables } from '@dale/ui';

export function Settlements() {
  return (
    <div className="flex h-screen bg-surface-app">
      <Sidebar active="settlements" onSelect={navigate} />
      <main className="flex-1 p-content-pad">
        <section className="bg-surface-card rounded-dale-lg px-dale-30 py-dale-37">
          <h1 className="text-dale-page-title text-text-heading">Settlements</h1>
          <Button variant="continue">Liquidar</Button>
        </section>
      </main>
    </div>
  );
}
```

### Tailwind v3

Importa `@dale/ui/styles.css` en `main.tsx` y añade el preset en `tailwind.config.js`:

```js
export default {
  presets: [require('@dale/ui/tailwind/preset')],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
};
```

(Con `"type": "module"` usa `import preset from '@dale/ui/tailwind/preset'`.)

## Qué clases añade a Tailwind

Solo **añade** clases; las de Tailwind no cambian (la única excepción es `font-sans`,
que pasa a ser Inter). Así una app existente sigue viéndose igual.

| Qué | Clases | Ejemplo |
| --- | --- | --- |
| Colores (los 109 tokens) | `bg-*`, `text-*`, `border-*`… con el nombre del token | `bg-surface-app`, `text-text-body`, `border-border-field`, `bg-dale-yellow` |
| Figma Variables con nombre de paleta | prefijo `fig-` | `border-fig-gray-300` |
| Espaciado Dale | `dale-8` … `dale-40` | `p-dale-37`, `gap-dale-30` |
| Medidas del layout | por nombre | `w-sidebar-width`, `h-header-height`, `p-content-pad` |
| Radios | `rounded-dale-*` | `rounded-dale-lg` (20px), `rounded-dale-pill` |
| Interlineado | `leading-dale-*` | `leading-dale-field` (1.4) |
| Sombras | por nombre | `shadow-flyout`, `shadow-soft` |
| Familias | `font-ui`, `font-display`, `font-secondary` | |
| Estilos tipográficos | `text-dale-*` (tamaño, interlineado y peso) | `text-dale-page-title`, `text-dale-body` |

Por la misma razón, los tokens de radio e interlineado se llaman `--radius-dale-*` y
`--leading-dale-*` (en el design system eran `--radius-lg`, `--leading-tight`…): esos
nombres ya los usa Tailwind. Si un token nuevo choca con una variable de Tailwind,
`npm run tokens` falla y dice cuál renombrar.

Los colores apuntan a variables CSS, así que cambiar `data-theme` en `<html>` también
cambia las clases de Tailwind. Sin Tailwind, todo está disponible como `var(--token)`
y como clases `.dale-page-title`, `.dale-body`, etc.

## Ejemplo de referencia: las pantallas del admin

`examples/admin/` es una app Vite con las pantallas del admin recreadas desde los frames
Hi-Res de Figma, usando solo `@dale/ui`: Dashboard, Operations › Transactions con su
detalle, Agent Network, Aggregators, Reconciliation, Pricing y Config. Su README dice qué
nodo de Figma recrea cada archivo y en qué se aparta del diseño.

```bash
npm install && npm run build      # en la raíz, una vez
cd examples/admin && npm install && npm run dev
```

El código de las pantallas (`examples/admin/src/`) viaja dentro del paquete, así que en la
app queda en `node_modules/@dale/ui/examples/admin/` para que Cursor lo use de referencia.
Si el ejemplo y Figma no coinciden, manda Figma.

## Para Cursor y otros agentes

Copia a la raíz del repo de la app:

- `templates/.cursor/rules/dale-ui.mdc` → `.cursor/rules/dale-ui.mdc`
- el contenido de `templates/AGENTS.dale-ui.md` → al `AGENTS.md` de la app (créalo si no existe)

Las reglas son cortas y apuntan a los archivos del paquete (`types/index.d.ts`,
`docs/components/`, `docs/BRAND.md`), así que se mantienen al día cuando subes de versión.

## Contenido

| Ruta | Qué |
| --- | --- |
| `tokens/tokens.json` | Fuente única de todos los tokens |
| `styles/` | `tokens.css` (generado) y `base.css` |
| `tailwind/` | Tema v4 y preset v3 (generados) |
| `src/`, `dist/` | Componentes y build |
| `types/index.d.ts` | Props de cada componente |
| `docs/` | Brand book y notas por componente |
| `fonts/`, `assets/` | Gilroy, logo, chevrones, íconos del header |
| `templates/` | Reglas para la app que consume el paquete |
| `examples/admin/` | Pantallas del admin de referencia (app Vite) |

## Mantener el paquete

- Los tokens se editan solo en `tokens/tokens.json`; `npm run tokens` regenera el CSS y Tailwind.
- `npm run build` compila la librería a `dist/`.
- Cada cambio sube la versión (semver) y se anota en `CHANGELOG.md`.
- Si el diseño cambia en el Design System de Claude, el cambio se trae a este repo: el repo es la fuente de verdad.

**Fuentes:** Gilroy es una fuente comercial. Antes de publicar el paquete, confirmen
que la licencia de Dale cubre distribuirla dentro de un paquete privado.
