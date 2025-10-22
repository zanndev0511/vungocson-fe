import React from "react";
import "@styles/components/input.scss";
import type { InputProps } from "@interfaces/components/input";

export const Input: React.FC<InputProps> = (props) => {
  const { id, label, type, value, onChange, onKeyDown, required, readonly, classNameLabel, className } =
    props;
  return (
    <div className="input-wrapper">
      <input
        id={id}
        type={type}
        value={value}
        placeholder=" "
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
        readOnly={readonly}
        className={`input font-size-sm ${className}`}
      />
      <p className={`input-label-focus text-uppercase text-font-regular font-size-sm ${classNameLabel}`}>
        {label}
        {required && <span className="input-mandatory">*</span>}
      </p>
    </div>
  );
};
