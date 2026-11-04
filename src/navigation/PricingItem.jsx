import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Pricing. Variants: state-button = Default | hover. */
export function PricingItem({ state = 'default', label = "Pricing", ...rest }) {
  return <SidebarItem icon="Pricing" label={label} state={state} {...rest} />;
}
export default PricingItem;
