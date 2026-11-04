import React from 'react';
import { SidebarItem } from './SidebarItem.jsx';

/** Dale sidebar — Dashboard. Variants: state-button = Default | hover. */
export function DashboardItem({ state = 'default', label = "Dashboard", ...rest }) {
  return <SidebarItem icon="Dashboard" label={label} state={state} {...rest} />;
}
export default DashboardItem;
