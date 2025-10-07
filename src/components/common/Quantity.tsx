import { ICONS } from "@constants/icons";
import { QuantityProps } from "@interfaces/components/quantity";
import "@styles/components/quantity.scss";
import React, { useEffect, useState } from "react";

export const Quantity: React.FC<QuantityProps> = (props) => {
  const { className, value = 1, onChange } = props;
  const [quantity, setQuantity] = useState<number>(value);

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onChange?.(quantity - 1);
    }
  };

  const increase = () => {
    setQuantity(quantity + 1);
    onChange?.(quantity + 1);
  };

  useEffect(() => {
    setQuantity(value);
  }, [value]);

  return (
    <div className={`d-flex flex-row items-center justify-center ${className}`}>
      <img
        src={ICONS.minus}
        alt="minus"
        className="quantity-icon"
        onClick={decrease}
      />
      <p className="text-font-regular font-size-sm pl-3 pr-3">{quantity}</p>
      <img
        src={ICONS.add}
        alt="add"
        className="quantity-icon"
        onClick={increase}
      />
    </div>
  );
};
