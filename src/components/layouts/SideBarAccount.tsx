import { Button } from "@components/common/Button";
import { ICONS } from "@constants/icons";
import type { SidebarAccountProps } from "@interfaces/components/sidebarAccount";
import "@styles/components/sidebarAccount.scss";
import { useNavigate } from "react-router";
import authApi from "@api/services/authApi";
import React from "react";
import Cookies from "js-cookie";

const SideBarAccount: React.FC<SidebarAccountProps> = (props) => {
  const { activeTab, setActiveTab, onClose, className } = props;
  let navigate = useNavigate();

  const menuItems = [
    { label: "My Account", icon: ICONS.user },
    { label: "My Orders", icon: ICONS.orders },
    { label: "Wishlist", icon: ICONS.wish },
    { label: "Addresses", icon: ICONS.address },
  ];
  const helpItems = [
    { label: "Contact Us", link: "/contact/" },
    { label: "Return Policy", link: "/returnPolicy/" },
    { label: "Privacy Policy", link: "/privacyPolicy/" },
    { label: "Terms and Conditions", link: "/termsAndConditions/" },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.href = "/";
      Cookies.remove("name");
      Cookies.remove("accessToken");

      if (onClose) onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to Logout");
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <div
        className={`sidebarAccount-container d-flex flex-col p-5 ${className}`}
      >
        <div className="sidebarAccount-cancel d-flex flex-row justify-center items-center">
          <img src={ICONS.cancel} alt="" onClick={onClose} />
        </div>

        <div className="sidebarAccount-content d-flex flex-col width-fullsize">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`${
                activeTab === index
                  ? "sidebarAccount-category-active-container"
                  : "sidebarAccount-category"
              } d-flex`}
              onClick={() => setActiveTab(index)}
            >
              {activeTab === index && (
                <div className="sidebarAccount-category-active-effect" />
              )}
              <div className="d-flex flex-row justify-start items-center pl-4">
                <img src={item.icon} alt=" " height={20} width={20} />
                <div className="d-flex justify-end items-end ml-2 pt-1">
                  <p className="text-font-regular font-size-base text-start">
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex flex-col justify-start items-start mt-4">
          <p className="text-font-semibold font-size-base">Need Help?</p>
          <div className="text-start ml-3">
            {helpItems.map((item, index) => (
              <p
                key={index}
                className="sidebarAccount-category-help text-font-light font-size-sm mt-3"
                onClick={() => navigate(item.link)}
              >
                {item.label}
              </p>
            ))}
          </div>
        </div>
        <div className="d-flex flex-row mt-5">
          <img src={ICONS.logout} alt=" " height={18} width={18} />
          <Button
            label={"LOG OUT"}
            variant="static-underline"
            className="ml-1"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
};

export default SideBarAccount;
