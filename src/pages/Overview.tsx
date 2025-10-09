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
      <div className="overview-content-wrap d-flex flex-row">
        <div
          className={`overview-sidebar ${isSideBarOpen ? "open" : "close"} `}
        >
          <SideBarAccount
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <div
          className="overview-header-menu d-flex flex-row justify-center items-center mt-4"
          onClick={() => setIsSidebarOpen(true)}
        >
          <img src={ICONS.right} alt="" />
        </div>
        <div className="overview-content width-fullsize">{content}</div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
