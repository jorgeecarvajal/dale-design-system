import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — "Monitoring Item" family. Since RevF it renders Config with the
 *  M3 settings gear (the family kept its Figma name). Variants: state-button = Default | hover. */
export function MonitoringItem({ state = 'default', label = "Config", ...rest }) {
  return <SidebarItem icon="Config" label={label} state={state} {...rest} />;
}
export default MonitoringItem;
