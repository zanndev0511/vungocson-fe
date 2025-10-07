import { RadioButtonProps } from "@interfaces/components/radioButton";
import "@styles/components/radioButton.scss";
import React from "react";

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  checked,
  onChange,
  name,
}) => {
  return (
    <label className="radioButton">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="radioButton-input"
      />
      <span className="radioButton-label text-font-regular font-size-sm text-capitalize">{label}</span>
    </label>
  );
};
