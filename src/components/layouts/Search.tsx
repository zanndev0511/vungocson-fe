import React, { useEffect, useState } from "react";
import "@styles/pages/search.scss";
import { SearchProps } from "@interfaces/pages/search";
import { ICONS } from "@constants/icons";
import { Input } from "@components/common/Input";
import { useNavigate } from "react-router-dom";

export const Search: React.FC<SearchProps> = (props) => {
  const navigate = useNavigate();
  const { isOpen, onClose } = props;
  const [searchText, setSearchText] = useState<string>("");

  const trendingSearches = [
    "Dress",
    "Shoes",
    "Accessories",
    "Bags",
    "Jumpsuits",
    "Tops",
    "Bottoms",
    "Outerwear",
    "Sunglasses",
    "Hats",
    "Jewelry",
  ];

  const handleSearch = () => {
    if (searchText.trim()) {
      onClose();
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

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
        className="search-header width-fullsize"
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
              {trendingSearches.map((item, index) => (
                <div
                  className="search-trending-item d-flex flex-row mt-2 items-center"
                  key={index}
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
          </div>
        </div>
      </div>
    </div>
  );
};
