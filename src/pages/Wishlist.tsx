import "@styles/pages/wishlist.scss";
import React, { useEffect, useState } from "react";
import { Overview } from "./Overview";
import type { WishlistItem } from "@interfaces/pages/wishlist";
import wishlistApi from "@api/services/wishlistApi";
import { useNavigate } from "react-router-dom";
import { ICONS } from "@constants/icons";

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.getAll();
      if (res.data) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await wishlistApi.remove(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove item from wishlist", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);
  return (
    <Overview
      activeNumber={2}
      content={
        <div className="wishlist-container d-flex flex-col width-fullsize">
          <div className="d-flex flex-col items-start width-fullsize p-5">
            <p className="text-font-bold font-size-xl">WISHLIST</p>
            <div className="wishlist-items-container justify-center items-center width-fullsize">
              {wishlist.length === 0 && (
                <p className="text-font-regular font-size-sm text-start mt-2">
                  Your wishlist is empty.
                </p>
              )}
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="wishlist-items-wrap d-flex flex-col items-center gap-4 mt-4"
                >
                  <div
                    className="wishlist-items-image"
                    onClick={() =>
                      navigate(
                        `/shop/product/${item.product.id}/${item.product.slug}`
                      )
                    }
                  >
                    <img src={item.product.productGallery[0]} alt="" />
                  </div>

                  <p className="text-font-semibold font-size-sm text-start">
                    {item.product.name}
                  </p>
                  <img
                    src={ICONS.cancel}
                    alt="Heart"
                    className="wishlist-items-heart"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.product.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};
