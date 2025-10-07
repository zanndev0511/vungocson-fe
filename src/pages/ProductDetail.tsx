import "@styles/pages/productDetail.scss";
import React, { useCallback, useEffect, useState } from "react";
import { Quantity } from "@components/common/Quantity";
import { ICONS } from "@constants/icons";
// import Carousel from "@components/layouts/Carousel";
import Footer from "@components/common/Footer";
import Modal from "@components/common/Modal";
import Header from "@components/common/Header";
import { useParams } from "react-router-dom";
import type { Product } from "@interfaces/pages/product";
import productApi from "@api/services/productApi";
import { Select } from "@components/common/Select";
import type { CartForm } from "@interfaces/pages/cart";
import DOMPurify from "dompurify";
import { CustomToOrder } from "@components/common/CustomToOrder";
import cartApi from "@api/services/cartApi";
import type { NotifyItem } from "@interfaces/pages/account";
import { toast } from "react-toastify";
import wishlistApi from "@api/services/wishlistApi";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [notify, setNotify] = useState<NotifyItem | null>(null);
  const [errorsInput, setErrorsInput] = useState<
    Partial<Record<keyof CartForm, string>>
  >({});
  const [isOpenCustomToOrder, setIsOpenCustomToOrder] =
    useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [tabs, setTabs] = useState({
    isDescription: false,
    isProductDetails: false,
  });

  const size: Array<string> = ["S", "M", "L"];
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [product, setProduct] = useState<Product>({
    sku: "",
    name: "",
    description: "",
    categories: [],
    collection: "None",
    slug: "",
    size: "",
    color: [],
    price: 0,
    tag: [],
    status: "active",
    productGallery: [],
    items: [],
  });

  const [itemCart, setItemCart] = useState<CartForm>({
    color: "",
    size: "",
    quantity: 1,
  });

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % product.productGallery.length);
  }, [product.productGallery.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.productGallery.length - 1 : prev - 1
    );
  };

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % product.productGallery.length);

  const prevImage = () =>
    setCurrentIndex(
      (prev) =>
        (prev - 1 + product.productGallery.length) %
        product.productGallery.length
    );
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const elem = document.querySelector(".productDetail-lightbox-overlay");
    if (!document.fullscreenElement) {
      if (elem) {
        elem.requestFullscreen().then(() => setIsFullscreen(true));
      }
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isZoomed) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsZoomed(false);
    } else {
      setScale(3);
      setIsZoomed(true);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setIsFullscreen(false);
    setIsZoomed(false);
    setLightboxOpen(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleChange = <K extends keyof CartForm>(
    field: K,
    value: CartForm[K]
  ) => {
    setItemCart((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CartForm, string>> = {};
    if (!itemCart.color) {
      newErrors.color = "Please select the color.";
    }
    setErrorsInput(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProductById = async (): Promise<Product | undefined> => {
    try {
      if (!id) return;
      const fetchedProduct = await productApi.getById(id);
      setProduct(fetchedProduct);
      return fetchedProduct;
    } catch (err) {
      console.error("Error fetching product by id:", err);
      setProduct({} as Product);
    }
  };

  const handleAddToCart = async () => {
    const { size, color, quantity } = itemCart;
    if (!validate()) return;
    try {
      await cartApi.add({
        productId: id!,
        size,
        color,
        quantity,
      });
      setNotify({
        status: "success",
        message: "Add to cart successfully!",
      });
    } catch (error: any) {
      console.error(error);
      if (error.response.statusText === "Unauthorized") {
        toast(
          "Log in to start building your cart and enjoy a faster checkout!",
          {
            className: "productDetail-toast text-font-regular font-size-sm",
            autoClose: 5000,
            position: "top-center",
          }
        );
      } else {
        setNotify({
          status: "fail",
          message: "Failed to add to cart!",
        });
      }
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

  const productSizeOptions: [string, string][] = size.map(
    (s): [string, string] => [s, s]
  );
  const productColorOptions: [string, string][] =
    product.color?.map((c): [string, string] => [c, c]) ?? [];

  useEffect(() => {
    fetchProductById();
  }, [id]);

  useEffect(() => {
    if (!notify) return;

    const timer = setTimeout(() => {
      setNotify(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notify]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <>
      {showModal && (
        <div className="account-modal d-flex justify-center items-center fullsize">
          <Modal
            onClose={() => setShowModal(false)}
            isButton={false}
            children={<p>Bảng size hiện ở đây</p>}
          />
        </div>
      )}
      <Header backgroundColor="black" />

      <div className="productDetail d-flex flex-col">
        <div className="productDetail-infor-image-wrap">
          <div className="productDetail-infor-image-container d-flex flex-col width-fullsize">
            <div
              className="productDetail-infor-image-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {product.productGallery.map((item, index) => (
                <div key={index} className="productDetail-infor-image-slide">
                  <img
                    src={item}
                    alt=""
                    className="productDetail-infor-image"
                    onClick={() => openLightbox(index)}
                  />
                </div>
              ))}
            </div>
            <div
              className="productDetail-infor-image-carousel-arrow arrow-left"
              onClick={goToPrev}
            >
              <img
                src={ICONS.left}
                alt=""
                className="productDetail-infor-image-carousel-arrow-icon"
              />
            </div>
            <div
              className="productDetail-infor-image-carousel-arrow arrow-right"
              onClick={goToNext}
            >
              <img
                src={ICONS.right}
                alt=""
                className="productDetail-infor-image-carousel-arrow-icon"
              />
            </div>

            <div className="productDetail-infor-image-dots">
              {product.productGallery.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          </div>
          <div className="productDetail-infor-wrap d-flex flex-col width-fullsize">
            <p className="productDetail-infor-product-name text-font-semibold font-size-xl text-start">
              {product.name}
            </p>
            <div className="d-flex flex-row mt-2">
              <p className="text-font-semibold font-size-md">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </p>
            </div>
            <div className="productDetail-divider mt-3" />
            <div className="d-flex flex-col items-start gap-2 mt-3">
              <p className="text-font-regular font-size-sm productDetail-infor-label text-start">
                COLOR:
              </p>
              <Select
                options={productColorOptions}
                value={itemCart.color}
                placeholder="Choose an option"
                onChange={(e) => handleChange("color", e.target.value)}
              />
              {errorsInput.color && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-1 ml-1">
                  {errorsInput.color}
                </p>
              )}
            </div>
            <div className="d-flex flex-col items-start gap-2 mt-3">
              <p className="text-font-regular font-size-sm productDetail-infor-label text-start">
                SIZE:
              </p>
              <Select
                options={productSizeOptions}
                value={itemCart.size}
                placeholder="Choose an option"
                onChange={(e) => handleChange("size", e.target.value)}
              />
              <p className="text-font-regular-italic font-size-sm text-start mt-1">
                Please select a size or If you want to custom size, please
                select "Custom To Order" below.
              </p>
            </div>
            <div className="d-flex flex-row items-center width-fullsize mt-3">
              <Quantity
                className="productDetail-infor-quantity"
                value={itemCart.quantity}
                onChange={(value) => handleChange("quantity", value)}
              />
              <button
                className="productDetail-infor-button text-font-regular font-size-base ml-3"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            </div>
            <div className="mt-3">
              {notify && (
                <div
                  className={`productDetail-notify ${
                    notify.status === "success" ? "success" : "fail"
                  } d-flex flex-row justify-start`}
                >
                  <p className="text-font-regular font-size-sm">
                    {notify.message}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-3">
              <div
                className="productDetail-infor-wishlist d-flex flex-row"
                onClick={() => toggleLike(String(product.id))}
              >
                <img
                  src={
                    likedItems.includes(String(product.id))
                      ? ICONS.heart_red
                      : ICONS.heart_line
                  }
                  alt=""
                  className="productDetail-infor-icon"
                />
                <p className="text-font-regular font-size-sm ml-3">
                  {likedItems.includes(String(product.id))
                    ? "REMOVE FROM WISHLIST"
                    : "ADD TO WISHLIST"}
                </p>
              </div>
              <div className="d-flex flex-col gap-2 mt-4">
                <div
                  className="productDetail-infor-customSize d-flex flex-row"
                  onClick={() => setIsOpenCustomToOrder(true)}
                >
                  <img
                    src={ICONS.pencil}
                    alt=""
                    className="productDetail-infor-icon"
                  />
                  <p className="text-font-regular font-size-sm ml-3">
                    CUSTOM TO ORDER
                  </p>
                </div>
                <div className="productDetail-infor-sizeGuide d-flex flex-row">
                  <img
                    src={ICONS.ruler}
                    alt=""
                    className="productDetail-infor-icon"
                  />
                  <p className="text-font-regular font-size-sm ml-3">
                    SIZE GUIDE
                  </p>
                </div>
              </div>
            </div>
            <div className="productDetail-divider mt-4" />
            <div className="d-flex flex-col pl-2 pr-2 pt-3 pb-3">
              <div className="d-flex flex-row justify-between">
                <p className="text-font-semibold font-size-base">DESCRIPTION</p>
                <img
                  src={tabs.isDescription ? ICONS.minus : ICONS.add}
                  alt=""
                  className="productDetail-infor-tabIcon"
                  onClick={() =>
                    setTabs((prev) => ({
                      ...prev,
                      isDescription: !tabs.isDescription,
                    }))
                  }
                />
              </div>
              <div
                className={`productDetail-infor-description-expandable ${
                  tabs.isDescription ? "open" : ""
                }`}
              >
                <div
                  className="productDetail-infor-description text-font-light font-size-base text-justify mt-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product?.description ?? "", {
                      FORBID_ATTR: ["style"],
                    }),
                  }}
                />
              </div>
            </div>
            <div className="productDetail-divider" />
            <div className="d-flex flex-col pl-2 pr-2 pt-3 pb-3">
              <div className="d-flex flex-row justify-between">
                <p className="text-font-semibold font-size-base">
                  PRODUCT DETAILS
                </p>
                <img
                  src={tabs.isProductDetails ? ICONS.minus : ICONS.add}
                  alt=""
                  className="productDetail-infor-tabIcon"
                  onClick={() =>
                    setTabs((prev) => ({
                      ...prev,
                      isProductDetails: !tabs.isProductDetails,
                    }))
                  }
                />
              </div>
              <div
                className={`productDetail-infor-description-expandable ${
                  tabs.isProductDetails ? "open" : ""
                }`}
              >
                <p className="productDetail-infor-description text-font-light font-size-base text-justify mt-3">
                  A design that brings charm and attraction to women. With
                  outstanding red color from high-quality velvet material, it
                  brings nobility and luxury. The high slit design enhances the
                  attractive physical beauty of the customer. Besides, the
                  meticulously shaped draping details create an interesting
                  feature for this outfit. A design that brings charm and
                  attraction to women. With outstanding red color from
                  high-quality velvet material, it brings nobility and luxury.
                  The high slit design enhances the attractive physical beauty
                  of the customer. Besides, the meticulously shaped draping
                  details create an interesting feature for this outfit.
                </p>
              </div>
            </div>
            <div className="productDetail-divider" />
          </div>
        </div>
        <div className="productDetail-recommend d-flex flex-col items-center">
          <p className="text-font-semibold font-size-xl">
            WE THINK YOU MIGHT LIKE
          </p>
          <div className="mt-4">
            {/* <Carousel itemProducts={itemsRecommend} /> */}
          </div>
        </div>
      </div>
      <div>
        <CustomToOrder
          isOpen={isOpenCustomToOrder}
          productId={id ?? ""}
          productName={product.name}
          productPrice={product.price}
          productColor={itemCart.color}
          productCategories={product.categories}
          onClose={() => setIsOpenCustomToOrder(false)}
        />
      </div>
      <div className="mt-5">
        <Footer />
      </div>
      {lightboxOpen && (
        <div
          className={`productDetail-lightbox-overlay ${
            isFullscreen ? "fullscreen" : ""
          }`}
        >
          <div className="productDetail-lightbox-counter text-font-semibold font-size-base">
            {currentIndex + 1} / {product.productGallery.length}
          </div>

          <div
            className="productDetail-lightbox-prev ml-5"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <img src={ICONS.left} alt="prev" width={30} height={30} />
          </div>

          <div className="d-flex flex-col">
            <img
              src={product.productGallery[currentIndex]}
              alt={product.name}
              className="productDetail-lightbox-image"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? "none" : "transform 0.3s ease",
                cursor:
                  scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
            />

            <div className="text-font-regular font-size-base text-white mt-3">
              {product.name}
            </div>
          </div>

          <div
            className="productDetail-lightbox-next mr-5"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <img src={ICONS.right} alt="next" width={30} height={30} />
          </div>

          <div className="productDetail-lightbox-control d-flex flex-row">
            <div className="productDetail-lightbox-control-icon-wrap">
              <img
                src={ICONS.expand}
                alt="expand"
                className="productDetail-lightbox-control-icon expand"
                onClick={toggleFullscreen}
              />
            </div>
            <div className="productDetail-lightbox-control-icon-wrap">
              <img
                src={isZoomed ? ICONS.zoomOut : ICONS.zoom}
                alt="zoom"
                className="productDetail-lightbox-control-icon ml-3"
                onClick={toggleZoom}
              />
            </div>
            <div className="productDetail-lightbox-control-icon-wrap">
              <img
                src={ICONS.cancel}
                alt="close"
                className="productDetail-lightbox-control-icon ml-3"
                onClick={closeLightbox}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
