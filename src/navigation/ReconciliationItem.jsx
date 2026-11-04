import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Reconciliation. Variants: state-button = Default | hover. */
export function ReconciliationItem({ state = 'default', label = "Reconciliation", ...rest }) {
  return <SidebarItem icon="Reconciliation" label={label} state={state} {...rest} />;
}
export default ReconciliationItem;
