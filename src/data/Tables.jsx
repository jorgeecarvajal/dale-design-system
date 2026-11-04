import React from 'react';
import { Icon } from '../icons/Icon.jsx';
import { Actions } from '../actions/Actions.jsx';
import { Checkboxes } from '../forms/Checkboxes.jsx';
import { Button } from '../actions/Button.jsx';

/* `Tables` (88:461). Geometry verbatim from the source; colours mapped onto the
   Dale palette (the source ships Untitled-UI grays, a purple secondary and a
   #14BA6D green that belong to no Dale swatch). */
const LINE = 'var(--dale-border-cool)';
const cellBase = { height: 44, boxSizing: 'border-box', borderBottom: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' };
const txt = (w, s, lh, c) => ({ fontFamily: 'var(--font-ui)', fontWeight: w, fontSize: s, lineHeight: lh, color: c });

function StatusBadge({ value }) {
  const on = /^(active|activo|activa)$/i.test(String(value));
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '2px 8px 2px 6px', boxSizing: 'border-box', borderRadius: 16,
      background: on ? 'color-mix(in oklch, var(--dale-green-contrast) 14%, var(--dale-white))' : 'var(--dale-sensitive)' }}>
      <span style={{ width: 6, height: 6, margin: 1, borderRadius: '50%', background: on ? 'var(--dale-green-contrast)' : 'var(--dale-gray-light)' }} />
      <span style={txt(500, 12, '18px', on ? 'var(--dale-black)' : 'var(--dale-gray-hard)')}>{value}</span>
    </span>
  );
}

export function Tables({
  title, description,
  columns = [], rows = [], selectable = true, rowActions = true,
  onDelete, onFilter, onExport, onAdd, addLabel = 'Add new',
  page = 1, pageCount = 1, onPageChange, resultCount, footerStart, fillHeight = false, dense = false, pageSize, pageSizeOptions, onPageSizeChange, style, className,
}) {
  const [sel, setSel] = React.useState(() => new Set());
  const hasHeader = !!(title || description || onDelete || onFilter || onExport || onAdd);
  // RevF: with no title, the result count moves up into the header, left of the actions.
  const countInHeader = hasHeader && !title && !description && resultCount != null;
  const H = dense ? 36 : 44;
  const PAD = dense ? '8px 16px' : '12px 24px';
  const all = rows.length > 0 && sel.size === rows.length;
  const some = sel.size > 0 && !all;
  const toggle = (i) => setSel((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleAll = () => setSel(all ? new Set() : new Set(rows.map((_, i) => i)));
  const pages = pageCount <= 7 ? Array.from({ length: pageCount }, (_, i) => i + 1)
    : [...new Set([1, page - 1, page, page + 1, pageCount].filter((p) => p >= 1 && p <= pageCount))].sort((a, b) => a - b);
  const go = (p) => onPageChange && p >= 1 && p <= pageCount && onPageChange(p);

  return (
    <div className={className} style={{ borderRadius: 8, background: 'var(--dale-white)', boxShadow: `inset 0 0 0 1px ${LINE}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', ...(fillHeight ? { flexGrow: 1, minHeight: 0 } : null), ...style }}>
      {hasHeader && <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: dense ? '10px 16px' : '20px 24px 19px', borderBottom: `1px solid ${LINE}`, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          {title && <span style={txt(500, 18, '28px', 'var(--dale-black)')}>{title}</span>}
          {countInHeader && <span style={txt(400, 14, '20px', 'var(--dale-gray-medium)')}>{Number(resultCount).toLocaleString('en-US')} result{resultCount === 1 ? '' : 's'}</span>}
          {description && <span style={txt(400, 14, '20px', 'var(--dale-gray-medium)')}>{description}</span>}
        </div>
        <Actions onDelete={onDelete ? () => onDelete([...sel]) : undefined} onFilter={onFilter} onExport={onExport} onPrimary={onAdd} primaryLabel={addLabel} primaryIcon="TablePlus" />
      </div>}
      <div style={{ overflowX: 'auto', ...(fillHeight ? { overflowY: 'auto', flexGrow: 1, minHeight: 0 } : null) }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 'max-content' }}>
          <thead style={fillHeight ? { position: 'sticky', top: 0, zIndex: 1 } : undefined}>
            <tr>
              {selectable && <th style={{ ...cellBase, height: H, width: 66, justifyContent: 'center', background: 'var(--dale-silver)', padding: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}><Checkboxes checked={all} indeterminate={some} tone="var(--dale-sky)" onChange={toggleAll} /></div></th>}
              {columns.map((c) => (
                <th key={c.key} style={{ ...cellBase, height: H, display: 'table-cell', verticalAlign: 'middle', padding: PAD, background: 'var(--dale-silver)', textAlign: 'left' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...txt(500, 12, '18px', 'var(--dale-gray-medium)') }}>
                    {c.label}{c.sortable !== false && <Icon name="TableArrowDown" size={16} />}
                  </span>
                </th>
              ))}
              {rowActions && <th style={{ ...cellBase, height: H, display: 'table-cell', width: 72, background: 'var(--dale-silver)' }} />}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {selectable && <td style={{ ...cellBase, height: H, display: 'table-cell', width: 66, padding: 0, verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><Checkboxes checked={sel.has(i)} tone="var(--dale-sky)" onChange={() => toggle(i)} /></div></td>}
                {columns.map((c) => (
                  <td key={c.key} style={{ ...cellBase, height: H, display: 'table-cell', verticalAlign: 'middle', padding: PAD }}>
                    {c.type === 'status' ? <StatusBadge value={r[c.key]} />
                      : <span style={c.bold ? txt(500, 14, '20px', 'var(--dale-black)') : txt(400, 14, '20px', 'var(--dale-gray-medium)')}>{r[c.key]}</span>}
                  </td>
                ))}
                {rowActions && <td style={{ ...cellBase, height: H, display: 'table-cell', width: 72, textAlign: 'center', verticalAlign: 'middle', padding: dense ? '6px 12px' : '14px 16px' }}>
                  <button type="button" aria-label="Row actions" onClick={() => typeof rowActions === 'function' && rowActions(r, i)}
                    style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: 'var(--dale-gray-medium)', display: 'inline-flex' }}><Icon name="TableMore" size={16} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(pageCount > 1 || (resultCount != null && !countInHeader) || pageSizeOptions || footerStart) && (
        <div style={{ minHeight: 40, display: 'flex', alignItems: 'center', gap: dense ? 16 : 21, padding: dense ? '0 16px' : '0 32px 0 24px', margin: dense ? '8px 0' : '12px 0', flexWrap: 'wrap' }}>
          {resultCount != null && !countInHeader && <span style={txt(500, 14, '20px', 'var(--dale-gray-hard)')}>{Number(resultCount).toLocaleString('en-US')} result{resultCount === 1 ? '' : 's'}</span>}
          {footerStart}
          <span style={{ flexGrow: 1 }} />
          {pageSizeOptions && (
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...txt(400, 14, '20px', 'var(--dale-gray-medium)') }}>Show
              <select value={pageSize} onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                style={{ height: 32, borderRadius: 8, border: '1px solid var(--gray-300)', background: 'var(--dale-white)', padding: '0 8px', cursor: 'pointer', ...txt(500, 14, '20px', 'var(--dale-dark)') }}>
                {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          )}
          {pageCount > 1 && <React.Fragment>
          <button type="button" onClick={() => go(page - 1)} style={{ border: 0, background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, ...txt(500, 15, '100%', 'var(--dale-dark)') }}><Icon name="TableChevronLeft" size={16} />Previous</button>
          {pages.map((p) => (
            <button key={p} type="button" onClick={() => go(p)} style={{
              width: p === page ? 40 : 'auto', height: 40, minWidth: 10, borderRadius: 10, border: 0, cursor: 'pointer', padding: 0,
              background: p === page ? 'var(--dale-dark)' : 'none', ...txt(500, 15, '100%', p === page ? 'var(--dale-white)' : 'var(--dale-dark)'),
            }}>{p}</button>
          ))}
          <button type="button" onClick={() => go(page + 1)} style={{ border: 0, background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, ...txt(500, 12, '100%', 'var(--dale-dark)') }}>Next<Icon name="TableChevronRight" size={16} /></button>
          </React.Fragment>}
        </div>
      )}
    </div>
  );
}
export default Tables;
