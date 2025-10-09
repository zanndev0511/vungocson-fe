import type { TextAreaProps } from '@interfaces/components/textArea';
import React from 'react'
import "@styles/components/textarea.scss";

export const TextArea: React.FC<TextAreaProps> = (props) => {
    const { id, label, value, onChange, required, classNameLabel, className } =
    props;
  return (
    <div className="textarea-wrapper">
      <textarea
        id={id}
        value={value}
        placeholder=" "
        onChange={onChange}
        required={required}
        className={`textarea font-size-sm ${className}`}
      />
      <p
        className={`textarea-label-focus text-uppercase text-font-regular font-size-xs ${classNameLabel}`}
      >
        {label}
        {required && <span className="textarea-mandatory">*</span>}
      </p>
    </div>
  )
}
