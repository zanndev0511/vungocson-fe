import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import { ICONS } from "@constants/icons";
import SideBarAccount from "@components/layouts/SideBarAccount";

import type { OverviewProps } from "@interfaces/pages/overview";
import "@styles/pages/overview.scss";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Overview: React.FC<OverviewProps> = (props) => {
  const { content, activeNumber } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(activeNumber);
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const tabMap: Record<string, number> = {
    "/me/account": 0,
    "/me/orders": 1,
    "/me/wishlist": 2,
    "/me/addresses": 3,
  };

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
    const path = Object.keys(tabMap).find((key) => tabMap[key] === tab);
    if (path) navigate(path);
  };

  useEffect(() => {
    const tab = tabMap[location.pathname];
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.pathname]);

  return (
    <>
      <Header backgroundColor="black" />
      <div className="overview-content d-flex flex-row">
        <SideBarAccount
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          className={`${
            isSideBarOpen ? "overview-sidebar-open" : "overview-sidebar-close"
          }`}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="overview-header-menu d-flex flex-row justify-center items-center mt-4">
          <img
            src={ICONS.right}
            alt=""
            onClick={() => setIsSidebarOpen(true)}
          />
        </div>
        {content}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
