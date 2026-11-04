import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Agent Network. Variants: state-button = Default | hover. */
export function AgentNetworkItem({ state = 'default', label = "Agent Network", ...rest }) {
  return <SidebarItem icon="AgentNetwork" label={label} state={state} {...rest} />;
}
export default AgentNetworkItem;
