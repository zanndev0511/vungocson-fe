import React from "react";

import type { BottomNavigationProps, NavItem } from "@interfaces/components/bottomNavigation";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

const BottomNavigation: React.FC<BottomNavigationProps> = (props) => {
  const { className } = props;
  const navigate = useNavigate();

  const navigation: Array<NavItem> = [
    { name: "HOME", src: "/" },
    { name: "SHOP", src: "/shop" },
    { name: "COLLECTIONS", src: "/collection" },

    { name: "RUNWAY", src: "/runway" },
    { name: "ABOUT", src: "/about" },
    { name: "NEWS", src: "/news" },
  ];

  return (
    <div className="d-flex text-font">
      {navigation.map((item) => (
        <Button label={item.name} className={`text-color mr-3 ml-3 ${className}`} onClick={() => navigate(item.src)}/>
      ))}
    </div>
  );
};

export default BottomNavigation;
