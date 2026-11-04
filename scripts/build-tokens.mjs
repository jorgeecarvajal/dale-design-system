// Generates every token output from tokens/tokens.json — the single source.
//   styles/tokens.css      CSS custom properties, type classes, @font-face
//   tailwind/theme.css     Tailwind v4 (@theme)
//   tailwind/preset.cjs    Tailwind v3 (presets: [...])
// Run: npm run tokens   (also runs before every build)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const T = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));
const out = (rel, text) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
const HEADER = '/* GENERATED from tokens/tokens.json by scripts/build-tokens.mjs — do not edit by hand. */';

const colors = T.color.tokens;
const [first, ...otherThemes] = T.color.themes.map((t) => t.id);
const alias = (v) => { const m = /^\{(.+)\}$/.exec(v); return m ? `var(--${m[1]})` : v; };
const valueIn = (t, theme) => (typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value[first]));
const list = (fam) => (T[fam]?.tokens ?? []);
const LENGTH_FAMILIES = ['spacing', 'radius', 'fontWeight', 'typeScale', 'layout', 'figma'];

// ---------- styles/tokens.css ----------
const css = [HEADER];
css.push(`:root, [data-theme="${first}"] {`);
for (const t of colors) css.push(`  --${t.name}: ${alias(valueIn(t, first))};`);
for (const t of list('shadow')) css.push(`  --${t.name}: ${t.value};`);
css.push('}');
for (const th of otherThemes) {
  css.push(`[data-theme="${th}"] {`);
  for (const t of colors) {
    const v = typeof t.value === 'string' ? t.value : t.value[th];
    if (v && (typeof t.value !== 'string' || v.startsWith('{'))) css.push(`  --${t.name}: ${alias(v)};`);
  }
  css.push('}');
}
css.push(':root {');
for (const fam of LENGTH_FAMILIES) for (const t of list(fam)) css.push(`  --${t.name}: ${t.value};`);
for (const [k, v] of Object.entries(T.type.families)) css.push(`  --font-${k}: ${v};`);
css.push('}');
for (const g of T.type.groups) for (const s of g.styles) {
  const d = [`font-family: var(--font-${s.family ?? g.family})`, `font-size: ${s.fontSize}`];
  if (s.lineHeight !== undefined) d.push(`line-height: ${s.lineHeight}`);
  if (s.fontWeight !== undefined) d.push(`font-weight: ${s.fontWeight}`);
  css.push(`.${s.name} { ${d.join('; ')}; }`);
}
const FMT = { otf: 'opentype', ttf: 'truetype', woff2: 'woff2', woff: 'woff' };
for (const f of T.type.fonts) {
  const file = f.file.split('/').pop();
  css.push(`@font-face { font-family: "${f.family}"; src: url("../fonts/${file}") format("${FMT[file.split('.').pop()]}"); font-weight: ${f.weight}; font-style: ${f.style ?? 'normal'}; font-display: swap; }`);
}
out('styles/tokens.css', css.join('\n') + '\n');

// ---------- Tailwind naming ----------
// Rule: add utilities, never redefine Tailwind's own (only font-sans changes, to Inter),
// so an app that already uses Tailwind keeps looking the same.
// Colours: one utility per token, pointing at the CSS variable, so a theme switch
// (data-theme) re-colours Tailwind classes too:  bg-surface-app, text-text-body, border-border-field.
// Figma Variables named like Tailwind's palette get a fig- prefix:  border-fig-gray-300.
// Spacing scale: prefixed so Tailwind's numeric scale keeps its meaning:  p-dale-37, gap-dale-30.
// Layout sizes: by name:  w-sidebar-width, h-header-height, p-content-pad.
// Radii and line heights: the tokens are named radius-dale-* / leading-dale-*, because
// --radius-lg and --leading-tight are Tailwind's own variables:  rounded-dale-lg, leading-dale-field.
// Shadows: by name:  shadow-flyout, shadow-soft.
// Type styles: text-<style> sets size, line height and weight, named as the CSS classes:
//   text-dale-page-title font-ui  (same look as the plain class .dale-page-title).
const TW_PALETTE = /^(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+$/;
const twColor = (name) => (TW_PALETTE.test(name) ? `fig-${name}` : name);
const spacing = Object.fromEntries([
  ...list('spacing').map((t) => [t.name.replace(/^space-/, 'dale-'), t.value]),
  ...list('layout').map((t) => [t.name, t.value]),
]);
const radius = Object.fromEntries(list('radius').map((t) => [t.name.replace(/^radius-/, ''), t.value]));
const leading = Object.fromEntries(list('typeScale').filter((t) => t.name.startsWith('leading-')).map((t) => [t.name.replace(/^leading-/, ''), t.value]));
const shadow = Object.fromEntries(list('shadow').map((t) => [t.name.replace(/^shadow-/, ''), t.value]));
const fonts = Object.fromEntries(Object.entries(T.type.families).map(([k, v]) => [k, v]));
const typeStyles = T.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, key: s.name.startsWith('dale-') ? s.name : `dale-${s.name}` })));

// ---------- tailwind/theme.css (v4) ----------
const v4 = [HEADER, '/* Tailwind v4. In your CSS:  @import "tailwindcss";  @import "@dale/ui/styles.css";  @import "@dale/ui/tailwind/theme.css"; */', '@theme inline {'];
for (const t of colors) v4.push(`  --color-${twColor(t.name)}: var(--${t.name});`);
for (const [k, v] of Object.entries(spacing)) v4.push(`  --spacing-${k}: ${v};`);
for (const [k, v] of Object.entries(radius)) v4.push(`  --radius-${k}: ${v};`);
for (const [k, v] of Object.entries(leading)) v4.push(`  --leading-${k}: ${v};`);
for (const [k, v] of Object.entries(shadow)) v4.push(`  --shadow-${k}: ${v};`);
for (const [k, v] of Object.entries(fonts)) v4.push(`  --font-${k}: ${v};`);
for (const s of typeStyles) {
  v4.push(`  --text-${s.key}: ${s.fontSize};`);
  if (s.lineHeight !== undefined) v4.push(`  --text-${s.key}--line-height: ${s.lineHeight};`);
  if (s.fontWeight !== undefined) v4.push(`  --text-${s.key}--font-weight: ${s.fontWeight};`);
}
v4.push('}');
out('tailwind/theme.css', v4.join('\n') + '\n');

// ---------- tailwind/preset.cjs (v3) ----------
const v3 = {
  theme: {
    extend: {
      colors: Object.fromEntries(colors.map((t) => [twColor(t.name), `var(--${t.name})`])),
      spacing,
      borderRadius: radius,
      lineHeight: leading,
      boxShadow: shadow,
      fontFamily: Object.fromEntries(Object.entries(fonts).map(([k, v]) => [k, v.split(/,\s*/)])),
      fontSize: Object.fromEntries(typeStyles.map((s) => [s.key, [s.fontSize, {
        ...(s.lineHeight !== undefined ? { lineHeight: String(s.lineHeight) } : {}),
        ...(s.fontWeight !== undefined ? { fontWeight: String(s.fontWeight) } : {}),
      }]])),
    },
  },
};
out('tailwind/preset.cjs', `${HEADER.replace('/*', '//').replace(' */', '')}\n// Tailwind v3:  module.exports = { presets: [require('@dale/ui/tailwind/preset')], ... }\nmodule.exports = ${JSON.stringify(v3, null, 2)};\n`);

// ---------- guard: no Dale variable may reuse one of Tailwind's own theme variables ----------
// Ours load after Tailwind's and would silently change its classes (rounded-lg, leading-tight…).
// The one intended override is --font-sans (Inter).
const ALLOWED_OVERRIDES = new Set(['--font-sans']);
try {
  const twTheme = readFileSync(join(root, 'node_modules/tailwindcss/theme.css'), 'utf8');
  const twVars = new Set([...twTheme.matchAll(/(--[\w-]+):/g)].map((m) => m[1]));
  const ours = [css.join('\n'), readFileSync(join(root, 'styles/base.css'), 'utf8'), v4.join('\n')].join('\n');
  const clash = [...new Set([...ours.matchAll(/(--[\w-]+):/g)].map((m) => m[1]))].filter((n) => twVars.has(n) && !ALLOWED_OVERRIDES.has(n));
  if (clash.length) { console.error(`Token names clash with Tailwind's own variables: ${clash.join(', ')}. Rename them in tokens/tokens.json.`); process.exit(1); }
} catch (e) { if (e.code !== 'ENOENT') throw e; }

console.log(`tokens:${colors.length} colours, ${Object.keys(spacing).length} spacing, ${Object.keys(radius).length} radii, ${Object.keys(shadow).length} shadows, ${typeStyles.length} type styles`);
