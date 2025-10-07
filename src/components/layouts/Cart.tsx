import React, { useEffect, useState } from "react";
import "@styles/pages/cart.scss";
import { CartItem, CartProps } from "@interfaces/pages/cart";
import { ICONS } from "@constants/icons";
import { Quantity } from "@components/common/Quantity";
import { useNavigate } from "react-router-dom";
import cartApi from "@api/services/cartApi";

export const Cart: React.FC<CartProps> = (props) => {
  const { isOpen, onClose } = props;

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getAll();
      if (res.data) {
        setCartItems(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };
  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    try {
      await cartApi.edit({ cartItemId, quantity: newQuantity });

      setCartItems((prev) =>
        prev.map((item) =>
          Number(item.id) === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await cartApi.remove({ cartItemId });
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== cartItemId)
      );
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    fetchCart();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <div
      className={`cart-container ${
        isOpen ? "cart-container-open" : "cart-container-closed"
      }`}
      onClick={onClose}
    >
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-end mt-4 mr-4 cart-close-wrapper">
          <img
            src={ICONS.cancel}
            alt="close"
            height={20}
            width={20}
            className="text-color cart-close-btn"
            onClick={onClose}
          />
        </div>
        <div className="cart-content pl-4 pr-4">
          <div className="d-flex flex-row items-start">
            <p className="text-font-regular font-size-xl">SHOPPING BAG</p>
            <div className="cart-quantity d-flex justify-center items-center">
              <p className="text-font-regular font-size-sm">
                {cartItems.length}
              </p>
            </div>
          </div>
          <div className="cart-item-container d-flex flex-col items-center width-fullsize">
            {cartItems.length === 0 && (
              <p className="text-font-regular font-size-base text-center mt-4">
                Your shopping cart is empty.
              </p>
            )}
            {cartItems.map((item) => (
              <div
                className="d-flex flex-col items-start width-fullsize mt-4"
                key={item.id}
              >
                <div className="cart-item d-flex flex-row justify-start items-start width-fullsize">
                  <img
                    src={item.product?.productGallery?.[0]}
                    alt=""
                    height={30}
                    width={90}
                    className="cart-imageProduct"
                  />
                  <div className="d-flex flex-col items-start width-fullsize ml-3">
                    <p className="text-font-semibold font-size-base text-uppercase width-fullsize text-start pr-5">
                      {item.product.name}
                    </p>
                    <div className="d-flex flex-row items-center font-size-sm width-fullsize mt-2">
                      <p className="cart-label text-font-regular text-start">
                        Color:
                      </p>
                      <p className="cart-label-value text-font-semibold text-start">
                        {item.color}
                      </p>
                    </div>
                    <div className="d-flex flex-row items-center justify-start font-size-sm width-fullsize mt-2">
                      <p className="cart-label text-font-regular text-start">
                        Size:
                      </p>
                      <p className="cart-label-value text-font-semibold text-start">
                        {item.size === "custom" ? "Custom" : item.size}
                      </p>
                    </div>
                    <div className="d-flex flex-row justify-between items-center width-fullsize mt-3">
                      <Quantity
                        className="cart-quantity-wrap"
                        value={item.quantity}
                        onChange={(newQuantity) =>
                          handleUpdateQuantity(Number(item.id), newQuantity)
                        }
                      />
                    </div>
                  </div>
                  <div
                    className="d-flex flex-row"
                    onClick={() => handleRemoveItem(Number(item.id))}
                  >
                    <img src={ICONS.trash} alt="" className="cart-remove" />
                  </div>
                  <div className="cart-item-cost d-flex flex-row mt-3">
                    <p className="text-font-semibold font-size-base ml-3">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <div className="cart-divider mt-3" />
              </div>
            ))}
          </div>
        </div>
        {cartItems.length !== 0 && (
          <div className="d-flex justify-center width-fullsize mb-5">
            <button
              className="cart-button text-font-regular"
              onClick={() => navigate("/checkout")}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
