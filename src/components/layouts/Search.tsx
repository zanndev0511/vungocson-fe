import React, { useEffect, useState } from "react";
import "@styles/pages/search.scss";
import type { SearchProps } from "@interfaces/pages/search";
import { ICONS } from "@constants/icons";
import { Input } from "@components/common/Input";
import { useNavigate } from "react-router-dom";
import categoryApi from "@api/services/categoryApi";
import type { Category } from "@interfaces/pages/category";
import menuApi from "@api/services/menuApi";
import type { MenuSideBar } from "@interfaces/components/sideBar";

export const Search: React.FC<SearchProps> = (props) => {
  const navigate = useNavigate();
  const { isOpen, onClose } = props;
  const [searchText, setSearchText] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [fetchMenu, setFetchMenu] = useState<MenuSideBar[]>([]);


  const handleSearch = () => {
    if (searchText.trim()) {
      onClose();
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      const items: Category[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const activeCategories = items.filter((cat) => cat.status === "active");

      const uniqueCategories = Array.from(
        new Map(
          activeCategories.map((cat) => [cat.name.toLowerCase(), cat])
        ).values()
      );

      const categoryNames: string[] = uniqueCategories.map((cat) => cat.name);

      setCategories(categoryNames);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  };

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
      fetchCategories();
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
      className={`search-container ${
        isOpen ? "search-container-open" : "search-container-closed"
      }`}
      onClick={onClose}
    >
      <div
        className="search-header"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-end mt-4 mr-4 search-close-wrapper">
          <img
            src={ICONS.cancel}
            alt="close"
            height={20}
            width={20}
            className="text-color search-close-btn"
            onClick={onClose}
          />
        </div>
        <div className="search-content pl-4 pr-4">
          <Input
            id={"search-input"}
            type={"text"}
            label="What are you looking for?"
            classNameLabel="search-input-label"
            className="search-input"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="d-flex flex-col justify-center items-start mt-4">
            <p className="text-font-semibold font-size-base">
              RECOMMEND SEARCHES
            </p>
            <div className="search-trending">
              {categories.map((item, index) => (
                <div
                  className="search-trending-item d-flex flex-row mt-2 items-center"
                  key={index}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
                >
                  <img
                    src={ICONS.search}
                    alt=""
                    className="search-trending-icon"
                  />
                  <p className="text-font-regular font-size-base ml-2">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-2">
              {fetchMenu.map((item, index) => (
                <div
                  className="search-trending-item d-flex flex-row mt-2 items-center"
                  key={index}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(item.title)}`)}
                >
                  <img
                    src={ICONS.search}
                    alt=""
                    className="search-trending-icon"
                  />
                  <p className="text-font-regular font-size-base ml-2">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
