import React, { useEffect, useState } from "react";

import { IMAGES } from "@constants/image";
import "@styles/components/header.scss";
import { ICONS } from "@constants/icons";
import { SideBar } from "./SideBar";
import { Search } from "@components/layouts/Search";
import { Login } from "@components/layouts/Login";
import { Cart } from "@components/layouts/Cart";
import { useNavigate } from "react-router-dom";
import type { HeaderProps } from "@interfaces/components/header";
import { Welcome } from "@components/layouts/Welcome";
import authApi from "@api/services/authApi";

const Header: React.FC<HeaderProps> = (props) => {
  const { backgroundColor, className } = props;
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const fetchUser = async () => {
    try {
      const res = await authApi.getProfile();
      if (res.email) {
        const username = res.email.split("@")[0];
        const usernameNoAccents = removeVietnameseTones(username);
        setUserName(usernameNoAccents);
      }
    } catch (error) {
      console.error("❌ Get user fail:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        className={`header-container ${
          backgroundColor === "black"
            ? "header-container-background-black"
            : "header-container-background-white"
        } ${className}`}
      >
        <div className="header-logo">
          <img
            src={
              backgroundColor === "black" ? IMAGES.whiteLogo : IMAGES.blackLogo
            }
            alt="logo"
            onClick={() => navigate("/")}
          />
        </div>

        <div
          className={`header-burger-menu d-flex gap-3 ${
            backgroundColor === "black" &&
            "header-container-background-black-icon"
          }`}
        >
          <img
            src={ICONS.search}
            alt=""
            height={20}
            width={20}
            className="text-color"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
            }}
          />
          <img
            src={ICONS.cart}
            alt=""
            height={20}
            width={20}
            className="text-color"
            onClick={() => {
              setIsCartOpen(!isCartOpen);
            }}
          />
          <img
            src={ICONS.user}
            alt=""
            height={20}
            width={20}
            className="text-color"
            onClick={() => {
              if (userName) {
                setIsWelcomeOpen(true);
              } else {
                setIsLoginOpen(!isLoginOpen);
              }
            }}
          />
          <img
            src={ICONS.burger_menu}
            alt="menu"
            height={35}
            width={35}
            className="ml-2"
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          />
        </div>
        <SideBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Welcome
          isOpen={isWelcomeOpen}
          onClose={() => setIsWelcomeOpen(false)}
        />
      </div>
      {isVisible && (
        <button
          className="scroll-to-top d-flex flex-row justify-center items-center"
          onClick={scrollToTop}
        >
          <img src={ICONS.arrowUp} alt="" />
        </button>
      )}
    </>
  );
};
export default Header;
