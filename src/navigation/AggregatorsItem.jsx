import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

const DEFAULT_FLYOUT = ["Profile","Bank Accounts","Integrations"];

/** Dale sidebar — Aggregators. Variants: state-button = Default | hover. */
export function AggregatorsItem({ state = 'default', label = "Aggregators", flyout = DEFAULT_FLYOUT, ...rest }) {
  return <SidebarItem icon="Aggregators" label={label} state={state} flyout={flyout} {...rest} />;
}
export default AggregatorsItem;
