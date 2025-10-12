import React, { useEffect, useState } from "react";
import { ICONS } from "@constants/icons";
import type { TopNavigationProps } from "@interfaces/components/topNavigation";
import "@styles/components/navigation.scss";
import { Button } from "./Button";
import { Search } from "@components/layouts/Search";
import { Login } from "@components/layouts/Login";
import { Cart } from "@components/layouts/Cart";
import { Welcome } from "@components/layouts/Welcome";
import Cookies from "js-cookie";
import authApi from "@api/services/authApi";
import { SideBar } from "./SideBar";

const TopNavigation: React.FC<TopNavigationProps> = (props) => {
  const { textColor, className, fontSize } = props;

  const [userName, setUserName] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  useEffect(() => {
    authApi
      .getProfile()
      .then((res) => {
        const username = res.email.split("@")[0];
        const usernameNoAccents = removeVietnameseTones(username);
        setUserName(usernameNoAccents);
      })
      .catch((err) => {
        console.error("❌ Get user fail:", err);
      });
  }, []);

  useEffect(() => {
    const handleFacebookMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { user, accessToken } = event.data;
      if (user?.name && accessToken) {
        Cookies.set("accessToken", accessToken);
        Cookies.set("name", user.name);
        setUserName(user.name);
      }
    };

    window.addEventListener("message", handleFacebookMessage);
    return () => {
      window.removeEventListener("message", handleFacebookMessage);
    };
  }, []);

  return (
    <div
      className={`navigation-control-wrap d-flex flex-row items-center justify-end width-fullsize ${className}`}
    >
      <div
        className={`navigation-control text-color d-flex ${fontSize}`}
        style={{ color: textColor }}
      >
        <img
          src={ICONS.search}
          alt=""
          height={18}
          width={18}
          className={`mr-1 ${textColor === "#ffffff" ? "icon-white" : ""}`}
        />
        <Button
          label={"Search"}
          className="text-font-regular"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          variant="hover-underline"
        />
      </div>
      <div
        className={`navigation-control text-color d-flex ${fontSize}`}
        style={{ color: textColor }}
      >
        <img
          src={ICONS.cart}
          alt=""
          height={18}
          width={18}
          className={`mr-1 ${textColor === "#ffffff" ? "icon-white" : ""}`}
        />
        <Button
          label={"Cart"}
          className="text-font-regular"
          onClick={() => setIsCartOpen(!isCartOpen)}
          variant="hover-underline"
        />
      </div>
      <div
        className={`navigation-control text-color d-flex ${fontSize}`}
        style={{ color: textColor }}
      >
        <img
          src={ICONS.user}
          alt=""
          height={18}
          width={18}
          className={`mr-1 ${textColor === "#ffffff" ? "icon-white" : ""}`}
        />
        <Button
          label={userName ? userName : "Login"}
          className="text-font-regular text-start"
          variant="hover-underline"
          onClick={() => {
            if (userName) {
              setIsWelcomeOpen(true);
            } else {
              setIsLoginOpen(!isLoginOpen);
            }
          }}
        />
      </div>
      <div className="navigation-control-menu-wrap">
        <img
          src={ICONS.burger_menu}
          alt="menu"
          height={35}
          width={35}
          className="navigation-control-menu"
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        />
      </div>

      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Welcome isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
    </div>
  );
};

export default TopNavigation;
