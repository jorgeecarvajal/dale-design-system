import React from 'react';
import { InputField } from './InputField.jsx';

/** `Input box with unit` (130:19421) — 120px InputField + 10px gap + unit label (Inter 16, 12px bottom offset). */
export function InputBoxWithUnit({ unit = 'unit', label = 'Label', value = 'Value', fieldWidth = 120, style, className, ...rest }) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'flex-end', ...style }}>
      <InputField label={label} value={value} style={{ width: fieldWidth, flexShrink: 0 }} {...rest} />
      <span style={{ paddingBottom: 12, fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: 16, lineHeight: '100%', color: 'var(--dale-black-pure)', whiteSpace: 'nowrap' }}>{unit}</span>
    </div>
  );
}
export default InputBoxWithUnit;
