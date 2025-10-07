import React, { useCallback, useEffect, useState } from "react";
import "@styles/pages/collections.scss";
import { ICONS } from "@constants/icons";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";
import { useNavigate, useParams } from "react-router-dom";
import type { Collection } from "@interfaces/pages/collections";
import collectionApi from "@api/services/collectionApi";
import { toast } from "react-toastify";
import wishlistApi from "@api/services/wishlistApi";
import DOMPurify from "dompurify";

export const Collections: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collection, setCollection] = useState<Collection>();

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

  const fetchCollectionById = async (): Promise<Collection | undefined> => {
    try {
      if (!id) return;
      const fetchedCollection = await collectionApi.getById(id);
      const activeProducts =
        fetchedCollection.products?.filter((p) => p.status === "active") || [];

      const filteredCollection = {
        ...fetchedCollection,
        products: activeProducts,
      };

      setCollection(filteredCollection);
    } catch (err) {
      console.error("Error fetching collection by id:", err);
      setCollection({} as Collection);
    }
  };

  const goToNext = useCallback(() => {
    if (!collection || !collection.banner || collection.banner.length === 0)
      return;
    setCurrentIndex((prev) => (prev + 1) % collection.banner.length);
  }, [collection]);

  const goToPrev = () => {
    if (!collection || !collection.banner || collection.banner.length === 0)
      return;
    setCurrentIndex((prev) =>
      prev === 0 ? collection.banner.length - 1 : prev - 1
    );
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    fetchCollectionById();
  }, [id]);

  useEffect(() => {
    if (!collection || !collection.banner || collection.banner.length === 0)
      return;
    const timer = setInterval(goToNext, 10000);
    return () => clearInterval(timer);
  }, [goToNext, collection]);

  const currentSlide = collection?.banner[currentIndex];

  return (
    <>
      <Header backgroundColor="black" />
      <div className="collections-carousel d-flex flex-column items-center justify-content-center">
        <div className="collections-carousel-slide d-flex items-center justify-content-center">
          <img
            src={ICONS.left}
            alt=""
            className="collections-carousel-arrow"
            onClick={goToPrev}
          />

          <div className="collections-carousel-image-wrapper">
            <img src={currentSlide} alt="" />
            <div className="collections-carousel-dots">
              {collection?.banner.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentIndex === index ? "active" : ""}`}
                  onClick={() => goToIndex(index)}
                ></span>
              ))}
            </div>
          </div>

          <img
            src={ICONS.right}
            alt=""
            className="collections-carousel-arrow"
            onClick={goToNext}
          />
        </div>

        <div className="collections-carousel-caption mt-4 mb-4">
          <h2 className="text-font-semibold font-size-md text-uppercase">
            {collection?.name?.trim()}
          </h2>
          <p
            className="collections-carousel-image-wrapper-text text-font-regular font-size-sm mt-2"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(collection?.description ?? "", {
                FORBID_ATTR: ["style"],
              }),
            }}
          ></p>
        </div>
      </div>
      <div className="collections-product p-5">
        {collection?.products.map((item) => (
          <div key={item.id} className="d-flex flex-col">
            <div
              className="collections-product-image"
              onClick={() => navigate(`/shop/product/${item.id}/${item.slug}`)}
            >
              <img
                src={item.productGallery[0]}
                alt={item.name}
                className={`collections-product-item ${
                  item.productGallery[1] && "image-default"
                }`}
              />

              {item.productGallery[1] && (
                <img
                  src={item.productGallery[1]}
                  alt={item.name}
                  className="collections-product-item image-hover"
                />
              )}

              <img
                src={
                  likedItems.includes(String(item.id))
                    ? ICONS.heart_red
                    : ICONS.heart_line
                }
                alt="Heart"
                className="collections-product-heart"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(String(item.id));
                }}
              />
            </div>
            <div className="d-flex flex-row items-start justify-between m-2">
              <div className="collections-product-item-infor d-flex flex-col width-fullsize font-size-sm width-fullsize">
                <p className="collections-product-item-infor-name text-font-semibold text-color text-start text-uppercase">
                  {item.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
