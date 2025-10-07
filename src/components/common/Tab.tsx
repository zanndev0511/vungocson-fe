import { TabsProps } from "@interfaces/components/tab";
import "@styles/components/tab.scss";
import React, { useState } from "react";

export const Tabs: React.FC<TabsProps> = (props) => {
  const { tabs, onTabChange } = props;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    if (onTabChange) onTabChange(index);
  };

  return (
    <div className="tabs">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tabs-button text-font-regular font-size-sm ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tabs-panel ${activeIndex === index ? "active" : ""}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
