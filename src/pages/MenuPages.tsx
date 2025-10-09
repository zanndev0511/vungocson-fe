import categoryApi from "@api/services/categoryApi";
import productApi from "@api/services/productApi";
import wishlistApi from "@api/services/wishlistApi";
import { Button } from "@components/common/Button";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import { SortButton } from "@components/common/SortButton";
import { ICONS } from "@constants/icons";
import type { Category } from "@interfaces/pages/category";
import type { Product } from "@interfaces/pages/product";
import "@styles/pages/shop.scss";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const MenuPages: React.FC = () => {
  const navigate = useNavigate();
  const { menu } = useParams<{ menu: string }>();

  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedColorIndexes, setSelectedColorIndexes] = useState<number[]>([
    0,
  ]);
  const [selectedCategoryIndexes, setSelectedCategoryIndexes] = useState<
    number[]
  >([0]);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number>(0);

  const fetchProducts = async () => {
    try {
      const data = await productApi.getAll();

      const items: Product[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      const activeNewItems = items.filter(
        (p) =>
          p.status === "active" &&
          Array.isArray(p.categories) &&
          p.categories.some((c) => {
            if (menu === "new-arrivals") {
              return c.toLowerCase() === "new";
            } else if (menu === "men") {
              return c.toLowerCase() === "men" || c.toLowerCase() === "man";
            } else if (menu === "women") {
              return c.toLowerCase() === "women" || c.toLowerCase() === "woman";
            } else if (menu) {
              return menu;
            }
          })
      );

      setProducts(activeNewItems);
      setFilteredProducts(activeNewItems);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setFilteredProducts([]);
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
      const filteredCategories = activeCategories.filter(
        (cat) => cat.name.toLowerCase() !== "new"
      );
      const uniqueCategories = Array.from(
        new Map(
          filteredCategories.map((cat) => [cat.name.toLowerCase(), cat])
        ).values()
      );
      const categoryNames: string[] = uniqueCategories.map((cat) => cat.name);

      setCategories(categoryNames);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  };

  const colorsSort = Array.from(
    new Set(products.flatMap((p) => p.color || []).filter(Boolean))
  );

  const categoriesSort = Array.from(
    new Set(categories.map((p) => p).filter(Boolean))
  );

  const applyFilter = () => {
    let tempProducts = [...products];

    if (!selectedColorIndexes.includes(0)) {
      const selectedColors = selectedColorIndexes.map((i) => colorsSort[i - 1]);
      tempProducts = tempProducts.filter((p) =>
        p.color?.some((c) => selectedColors.includes(c))
      );
    }

    if (!selectedCategoryIndexes.includes(0)) {
      const selectedCategories = selectedCategoryIndexes.map(
        (i) => categoriesSort[i - 1]
      );
      tempProducts = tempProducts.filter((p) =>
        p.categories?.some((cat) => selectedCategories.includes(cat))
      );
    }

    if (selectedPriceIndex === 0) {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (selectedPriceIndex === 1) {
      tempProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(tempProducts);
  };

  const resetFilter = () => {
    setSelectedColorIndexes([0]);
    setSelectedCategoryIndexes([0]);
    setSelectedPriceIndex(0);
    setFilteredProducts(products);
    fetchProducts();
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

  const isNewProduct = (item: Product): boolean => {
    return item.categories?.some((cat) => cat.toLowerCase() === "new") ?? false;
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchWishlist();
  }, []);

  return (
    <>
      <Header backgroundColor="black" />
      <div className="shop p-5">
        <div className="d-flex flex-col justify-center items-center">
          <p className="text-font-semibold font-size-md">
            ALL PRODUCTS ({filteredProducts.length})
          </p>
          <div className="shop-product-filter mt-3">
            <div className="d-flex flex-row gap-5">
              <SortButton
                title="Color"
                options={["All", ...colorsSort]}
                selectedIndexes={selectedColorIndexes}
                onChange={(indexes) => {
                  let newIndexes = indexes;

                  if (newIndexes.includes(0) && newIndexes.length > 1) {
                    newIndexes = newIndexes.filter((i) => i !== 0);
                  }
                  if (newIndexes.length === 0) {
                    newIndexes = [0];
                  }

                  setSelectedColorIndexes(newIndexes);
                }}
              />
              <SortButton
                title="Category"
                options={["All", ...categoriesSort]}
                selectedIndexes={selectedCategoryIndexes}
                onChange={(indexes) => {
                  let newIndexes = indexes;

                  if (newIndexes.includes(0) && newIndexes.length > 1) {
                    newIndexes = newIndexes.filter((i) => i !== 0);
                  }
                  if (newIndexes.length === 0) {
                    newIndexes = [0];
                  }
                  setSelectedCategoryIndexes(newIndexes);
                }}
              />
              <SortButton
                title="Prices"
                options={["Low to High", "High to Low"]}
                selectedIndexes={[selectedPriceIndex]}
                onChange={(indexes) => setSelectedPriceIndex(indexes[0])}
                type="choice"
              />
            </div>

            <div className="shop-product-filter-button-container text-font-semibold text-uppercase">
              <Button
                label={"Apply"}
                variant="static-underline"
                onClick={applyFilter}
              />
              <Button
                label={"Reset"}
                variant="hover-underline"
                className="ml-3"
                onClick={resetFilter}
              />
            </div>
          </div>
        </div>
        <div className="shop-product mt-5">
          {products.length === 0 && (
            <p className="text-font-regular text-center p-4">
              No product found.
            </p>
          )}
          {filteredProducts.map((item) => (
            <div key={item.id} className="d-flex flex-col">
              <div
                className="shop-product-image"
                onClick={() =>
                  navigate(`/shop/product/${item.id}/${item.slug}`)
                }
              >
                <img
                  src={item.productGallery[0]}
                  alt={item.name}
                  className={`shop-product-item ${
                    item.productGallery[1] && "image-default"
                  }`}
                />

                {item.productGallery[1] && (
                  <img
                    src={item.productGallery[1]}
                    alt={item.name}
                    className="shop-product-item image-hover"
                  />
                )}

                {isNewProduct(item) && (
                  <div className="shop-product-newTag d-flex items-center justify-center">
                    <p className="font-size-sm text-font-semibold">NEW!</p>
                  </div>
                )}

                <img
                  src={
                    likedItems.includes(String(item.id))
                      ? ICONS.heart_red
                      : ICONS.heart_line
                  }
                  alt="Heart"
                  className="shop-product-heart"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(String(item.id));
                  }}
                />
              </div>
              <div className="d-flex flex-row items-start justify-between m-2">
                <div className="shop-product-item-infor d-flex flex-col width-fullsize font-size-sm width-fullsize">
                  <p className="shop-product-item-infor-name text-font-semibold text-color text-start text-uppercase">
                    {item.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fullsize">
        <Footer />
      </div>
    </>
  );
};
