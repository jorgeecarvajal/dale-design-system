import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Settlements. Variants: state-button = Default | hover. */
export function SettlementsItem({ state = 'default', label = "Settlements", ...rest }) {
  return <SidebarItem icon="Settlements" label={label} state={state} {...rest} />;
}
export default SettlementsItem;
