import React, { useEffect, useState } from "react";
import "@styles/pages/result.scss";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";
import productApi from "@api/services/productApi";
import wishlistApi from "@api/services/wishlistApi";
import type { Product } from "@interfaces/pages/product";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ICONS } from "@constants/icons";
import { toast } from "react-toastify";

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const [products, setProducts] = useState<Product[]>([]);
  const [likedItems, setLikedItems] = useState<string[]>([]);

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) return;
    try {
      const res = await productApi.search(keyword);
      setProducts(res);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const toggleLike = async (productId: string) => {
    try {
      if (likedItems.includes(productId)) {
        await wishlistApi.remove(productId);
        setLikedItems((prev) => prev.filter((id) => id !== productId));
      } else {
        await wishlistApi.add({ productId });
        setLikedItems((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);
      toast("Please log in to add products to your wishlist.", {
        className: "result-toast text-font-regular font-size-sm",
        autoClose: 5000,
        position: "top-center",
      });
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.getAll();
      if (res.data) {
        const productIds = res.data.map((item) => item.product.id);
        setLikedItems(productIds);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  useEffect(() => {
    if (q) {
      handleSearch(q);
    }
  }, [q]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <>
      <Header backgroundColor="black" />
      <div className="result d-flex flex-col items-center">
        <p className="text-font-bold font-size-xl text-start width-fullsize mt-5">
          Result for "{q}" ({products.length} results)
        </p>
        <div className="result-container justify-center items-center width-fullsize mt-4">
          {products.length === 0 && (
            <p className="text-font-regular font-size-sm text-start width-fullsize">
              No products found for your search.
            </p>
          )}

          {products.map((item) => (
            <div key={item.id} className="result-wrap d-flex flex-col gap-2">
              <div
                className="result-image"
                onClick={() =>
                  navigate(`/shop/product/${item.id}/${item.slug}`)
                }
              >
                <img
                  src={item.productGallery[0]}
                  alt=""
                  className={item.productGallery[1] && "img-default"}
                />
                {item.productGallery[1] && (
                  <img
                    src={item.productGallery[1]}
                    alt={item.name}
                    className="img-hover"
                  />
                )}
              </div>
              <p className="text-font-semibold font-size-sm text-start text-uppercase width-fullsize">
                {item.name}
              </p>
              <img
                src={
                  likedItems.includes(String(item.id))
                    ? ICONS.heart_red
                    : ICONS.heart_line
                }
                alt="Heart"
                className="result-heart"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(String(item.id));
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
