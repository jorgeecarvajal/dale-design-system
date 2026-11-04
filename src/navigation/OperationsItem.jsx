import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Operations. Variants: state-button = Default | hover. */
export function OperationsItem({ state = 'default', label = "Operations", ...rest }) {
  return <SidebarItem icon="Operations" label={label} state={state} {...rest} />;
}
export default OperationsItem;
