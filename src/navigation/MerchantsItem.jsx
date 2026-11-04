import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Merchants. Variants: state-button = Default | hover. */
export function MerchantsItem({ state = 'default', label = "Merchants", ...rest }) {
  return <SidebarItem icon="Merchants" label={label} state={state} {...rest} />;
}
export default MerchantsItem;
