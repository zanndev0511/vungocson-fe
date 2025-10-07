import { ICONS } from "@constants/icons";
import "@styles/components/sortButton.scss";
import { useEffect, useRef, useState } from "react";
import { CheckBox } from "./CheckBox";
import type { SortButtonProps } from "@interfaces/components/sortButton";
import { RadioButton } from "./RadioButton";

export const SortButton: React.FC<SortButtonProps> = (props) => {
  const {
    title,
    options,
    selectedIndexes = [],
    onChange,
    className,
    type = "checkbox",
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [chosenIndexes, setChosenIndexes] = useState<number[]>(selectedIndexes);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const toggleOption = (idx: number) => {
    if (type === "checkbox") {
      const newChosen = chosenIndexes.includes(idx)
        ? chosenIndexes.filter((i) => i !== idx)
        : [...chosenIndexes, idx];
      setChosenIndexes(newChosen);
      onChange?.(newChosen);
    } else {
      setSelectedSort(options[idx]);
      onChange?.([idx]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setChosenIndexes(selectedIndexes);
  }, [selectedIndexes]);

  return (
    <div ref={wrapperRef} className={`sortButton d-flex flex-col ${className}`}>
      <div
        className="d-flex flex-row items-center gap-1 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="sortButton-hover-underline text-font-regular">{title}</p>
        <img
          src={ICONS.down}
          alt="arrow"
          height={20}
          width={20}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div
          className={`sortButton-modal ${
            type === "checkbox" &&
            "sortButton-modal-grid justify-center items-center"
          } animate-fadeIn`}
        >
          {options.map((opt, idx) =>
            type === "checkbox" ? (
              <CheckBox
                key={idx}
                isCheck={chosenIndexes.includes(idx)}
                setIsCheck={() => toggleOption(idx)}
                titleBtn={opt}
                classNameContainer="items-center"
                className="text-capitalize"
              />
            ) : (
              <div key={idx} className={`${idx !== 0 && "mt-2"} `}>
                <RadioButton
                  label={opt}
                  value={opt}
                  name="sortRadio"
                  checked={selectedSort === opt}
                  onChange={() => toggleOption(idx)}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
