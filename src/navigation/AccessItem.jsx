import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Access. Variants: state-button = Default | hover. */
export function AccessItem({ state = 'default', label = "Access", ...rest }) {
  return <SidebarItem icon="Access" label={label} state={state} {...rest} />;
}
export default AccessItem;
