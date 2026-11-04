import React from 'react';
import { Icon } from '../icons/Icon.jsx';
import { Button } from './Button.jsx';

const f = (w, s, lh, c) => ({ fontFamily: 'var(--font-ui)', fontWeight: w, fontSize: s, lineHeight: lh, color: c });

function ActionButton({ icon, children, outlined, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      height: 40, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', boxSizing: 'border-box',
      borderRadius: 8, border: 0, cursor: 'pointer', background: 'var(--dale-white)',
      boxShadow: outlined ? 'inset 0 0 0 1px var(--gray-300)' : 'none', whiteSpace: 'nowrap',
      ...f(500, 14, '20px', 'var(--dale-gray-hard)'),
    }}>
      <Icon name={icon} size={20} />{children}
    </button>
  );
}

/** RevF "Actions" (167:3576): Delete · Filters (ghost) · Export (outlined) · primary. Each renders only when its handler is passed. */
export function Actions({ onDelete, onFilter, onExport, onPrimary, primaryLabel = 'Add new', primaryIcon = 'Add', style, className, ...rest }) {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', ...style }} {...rest}>
      {(onDelete || onFilter) && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {onDelete && <ActionButton icon="TableTrash" onClick={onDelete}>Delete</ActionButton>}
          {onFilter && <ActionButton icon="TableFilter" onClick={onFilter}>Filters</ActionButton>}
        </div>
      )}
      {onExport && <ActionButton icon="TableDownload" outlined onClick={onExport}>Export</ActionButton>}
      {onPrimary && <Button variant="continue" icon={<Icon name={primaryIcon} size={20} />} onClick={onPrimary}>{primaryLabel}</Button>}
    </div>
  );
}
export default Actions;
