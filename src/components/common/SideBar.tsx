import React, { useEffect, useState } from "react";
import { MenuSideBar, SidebarProps } from "@interfaces/components/sideBar";
import "@styles/components/sidebar.scss";
import { ICONS } from "@constants/icons";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import menuApi from "@api/services/menuApi";

export const SideBar: React.FC<SidebarProps> = (props) => {
  const { isOpen, onClose } = props;
  const navigate = useNavigate();

  const [fetchMenu, setFetchMenu] = useState<MenuSideBar[]>([]);
  const navigation = [
    { name: "Home", src: "/" },
    { name: "Shop", src: "/shop" },

    { name: "Runway", src: "/runway" },
    { name: "About", src: "/about" },
    { name: "News", src: "/news" },
  ];
  const productNavigation = [
    { name: "New Arrivals", src: "/shop/new-arrivals" },
    { name: "Made To Order", src: "/made-to-order" },
  ];

  const specNavigation = [
    { name: "My Orders", src: "/account" },
    { name: "Contact", src: "/account" },
    { name: "FAQ", src: "/account" },
    { name: "Support", src: "/account" },
  ];

  const fetchMenus = async () => {
    try {
      const response = await menuApi.getAll();
      const items: MenuSideBar[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      const activeItems = items
        .filter((item) => item.status === "active")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setFetchMenu(activeItems);
    } catch (error) {
      console.error("Failed to fetch Menus:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`sidebar-container ${
        isOpen ? "sidebar-container-open" : "sidebar-container-closed"
      }`}
      onClick={onClose}
    >
      <div className="sidebar-header" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-end mt-4 mr-4 sidebar-close-wrapper">
          <img
            src={ICONS.cancel}
            alt="close"
            height={20}
            width={20}
            className="text-color sidebar-close-btn"
            onClick={onClose}
          />
        </div>
        <div className="sidebar-content text-uppercase">
          <ul className="d-flex flex-col items-start justify-center ml-5">
            {productNavigation.map((item, index) => (
              <li
                key={index}
                className="sidebar-item text-font-medium text-uppercase font-size-md mb-3"
              >
                <Button
                  label={item.name}
                  key={index}
                  variant="hover-underline"
                  onClick={() => navigate(item.src)}
                />
              </li>
            ))}
          </ul>
          <ul className="d-flex flex-col items-start justify-center ml-5 mt-4">
            {fetchMenu.map((item, index) => (
              <li
                key={index}
                className="sidebar-item text-font-regular font-size-md mb-3"
              >
                <Button
                  label={item.title}
                  key={index}
                  variant="hover-underline"
                  onClick={() => {
                    navigate(`/collection${item.url}`);
                    if (onClose) onClose();
                  }}
                />
              </li>
            ))}
          </ul>
          <ul className="d-flex flex-col items-start justify-center ml-5 mt-4">
            {navigation.map((item, index) => (
              <li
                key={index}
                className="sidebar-item text-font-regular font-size-md mb-3"
              >
                <Button
                  label={item.name}
                  key={index}
                  variant="hover-underline"
                  onClick={() => navigate(item.src)}
                />
              </li>
            ))}
          </ul>

          <ul className="d-flex flex-col items-start justify-center ml-5 mt-4">
            {specNavigation.map((item, index) => (
              <li key={index} className="text-font-regular font-size-md mb-3">
                <Button
                  label={item.name}
                  key={index}
                  variant="static-underline"
                  onClick={() => navigate(item.src)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
