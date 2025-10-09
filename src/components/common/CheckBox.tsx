import React from "react";
import "@styles/components/checkbox.scss";
import type { CheckBoxProps } from "@interfaces/components/checkbox";
import { ICONS } from "@constants/icons";

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const { isCheck, className, titleBtn, classNameContainer, setIsCheck } =
    props;
  return (
    <div
      className={`checkbox d-flex flex-row ${classNameContainer}`}
      onClick={() => {
        if (!isCheck) {
          setIsCheck(true);
        } else {
          setIsCheck(false);
        }
      }}
    >
      {isCheck ? (
        <div className="checkbox-tick">
          <img src={ICONS.done} alt=""/>
        </div>
      ) : (
        <div className="checkbox-noTick"></div>
      )}

      <p
        className={`text-font-regular font-size-sm text-start ml-2 ${className}`}
      >
        {titleBtn}
      </p>
    </div>
  );
};
