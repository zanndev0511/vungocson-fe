import { ICONS } from "@constants/icons";
import type { SelectProps } from "@interfaces/components/select";
import "@styles/components/select.scss";
import React, { useState } from "react";

export const Select: React.FC<SelectProps> = (props) => {
  const { label, value, onChange, onClick, required, options, placeholder } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="select-wrapper d-flex justify-center items-center">
      <select
        className={`${label ? "select" : "select-noLabel"} select ${
          value ? "has-value" : ""
        } text-font-regular`}
        value={value ? value : ""}
        onChange={onChange}
        required={required}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={onClick}
      >
        <option value="" disabled hidden>
          {!label && placeholder}
        </option>
        {options.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      <p className="select-label text-uppercase text-font-regular text-start">
        {label}
        {required && <span className="select-mandatory">*</span>}
      </p>
      <div className="select-down d-flex justify-center items-center mr-3">
        <img
          src={ICONS.down}
          alt=""
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
};
