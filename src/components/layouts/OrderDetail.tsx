import { ICONS } from "@constants/icons";
import { IMAGES } from "@constants/image";
import { OrderDetailProps } from "@interfaces/pages/orderDetails";
import "@styles/pages/orderDetail.scss";

import React, { useEffect } from "react";

const OrderDetail: React.FC<OrderDetailProps> = (props) => {
  const {selectedProduct, setSelectedProduct} = props
  console.log(selectedProduct)
  useEffect(() => {
    const nodes = document.querySelectorAll(".orderDetail-tracking-count");
    const line = document.querySelector(
      ".orderDetail-tracking-node-line"
    ) as HTMLElement | null;

    if (line) {
      const nodeCount = nodes.length - 1;
      const lineHeight = nodeCount * 8.5;
      line.style.height = `${lineHeight}%`;
    }
  }, []);

  return (
    <>
      <div className="d-flex flex-row justify-between items-center p-3">
        <img src={ICONS.left} alt=" " className="orderDetail-return" onClick={()=> setSelectedProduct(0)}/>
        <div className="d-flex flex-row">
          <p className="text-font-semibold font-size-base">
            ID: <span className="ml-2">051103</span>
          </p>
          <p className="text-font-regular font-size-base ml-2">|</p>
          <div className="d-flex ml-2">
            <img src={ICONS.truck} alt=" " />
            <p className="orderDetail-status text-font-semibold font-size-base ml-2">
              Delivered successfully
            </p>
          </div>
        </div>
      </div>
      <div className="orderDetail-line" />
      <div className="d-flex flex-row jusitfy-between items-center width-fullsize p-4">
        <div className="d-flex flex-col jusitfy-center items-center width-fullsize">
          <div className="d-flex flex-row jusitfy-center items-center">
            <div className="orderDetail-status-container d-flex justify-center items-center">
              <img src={ICONS.receipt} alt="" about=" " />
            </div>
            <div className="orderDetail-status-line" />
          </div>
          <p className="text-font-regular font-size-base mt-3">Ordered</p>
          <div className="d-flex flex-row items-center text-font-light font-size-sm">
            <p>17:15</p>
            <p className="ml-2">11/05/2025</p>
          </div>
        </div>
        <div className="d-flex flex-col jusitfy-center items-center width-fullsize">
          <div className="d-flex flex-row jusitfy-center items-center">
            <div className="orderDetail-status-container d-flex justify-center items-center">
              <img src={ICONS.money} alt="" about=" " />
            </div>
            <div className="orderDetail-status-line" />
          </div>
          <p className="text-font-regular font-size-base mt-3">
            Payment confirmed
          </p>
          <div className="d-flex flex-row items-center text-font-light font-size-sm">
            <p>17:15</p>
            <p className="ml-2">11/05/2025</p>
          </div>
        </div>
        <div className="d-flex flex-col jusitfy-center items-center width-fullsize">
          <div className="d-flex flex-row jusitfy-center items-center">
            <div className="orderDetail-status-container d-flex justify-center items-center">
              <img src={ICONS.truck} alt="" about=" " />
            </div>
            <div className="orderDetail-status-line" />
          </div>
          <p className="text-font-regular font-size-base mt-3">Shipped out</p>
          <div className="d-flex flex-row items-center text-font-light font-size-sm">
            <p>17:15</p>
            <p className="ml-2">11/05/2025</p>
          </div>
        </div>
        <div className="d-flex flex-col jusitfy-center items-center width-fullsize">
          <div className="d-flex flex-row jusitfy-center items-center">
            <div className="orderDetail-status-container orderDetail-status-container-done d-flex justify-center items-center">
              <img
                src={ICONS.pack}
                alt=""
                about=" "
                className="orderDetail-status-container-done-icon"
              />
            </div>
          </div>
          <p className="text-font-regular font-size-base mt-3">
            Package received
          </p>
          <div className="d-flex flex-row items-center text-font-light font-size-sm">
            <p>17:15</p>
            <p className="ml-2">11/05/2025</p>
          </div>
        </div>
      </div>
      <div className="orderDetail-line" />
      <div className="d-flex flex-col p-4">
        <div className="d-flex flex-row justify-between items-center">
          <p className="text-font-semibold font-size-md text-uppercase">
            Detail Information
          </p>
          <div className="d-flex flex-col text-font-light font-size-sm">
            <p className="text-end">DHL</p>
            <p>SPXVN050115015387</p>
          </div>
        </div>
        <div className="d-flex flex-row justify-start items-start mt-4">
          <div className="d-flex flex-col items-start">
            <p className="text-font-semibold font-size-base">
              Truong Thi Huong Giang
            </p>
            <div className="text-font-regular font-size-sm text-start mt-2">
              <p>(+84) 819507689</p>
              <p>So 29, Le Trung Dinh, Hoa Hai, Ngu Hanh Son, Da Nang</p>
            </div>
          </div>
          <div className="d-flex flex-col ml-5">
            <div className="orderDetail-tracking-count d-flex flex-row">
              <div className="d-flex flex-col items-center">
                <div className="orderDetail-tracking-node-done">
                  <img
                    src={ICONS.done}
                    alt=""
                    className="orderDetail-tracking-node-icon"
                  />
                </div>
                <div className="orderDetail-tracking-node-line" />
              </div>
              <div className="d-flex flex-row text-font-regular font-size-base ml-2">
                <p>11:42</p>
                <p className="ml-2">07/30/2025</p>
              </div>
              <div className="orderDetail-tracking-node-status-done d-flex flex-col items-start ml-3">
                <p className="text-font-semibold font-size-base">Delivered</p>
                <p className="text-font-regular text-start font-size-sm">
                  Successfully delivered
                </p>
              </div>
            </div>
            <div className="orderDetail-tracking-count d-flex flex-row mt-3">
              <div className="d-flex flex-col items-center">
                <div className="orderDetail-tracking-node">
                  <img
                    src={ICONS.truck}
                    alt=""
                    className="orderDetail-tracking-node-icon orderDetail-tracking-node-icon-normal"
                  />
                </div>
              </div>
              <div className="d-flex flex-row text-font-regular font-size-base ml-2">
                <p>11:42</p>
                <p className="ml-2">07/30/2025</p>
              </div>
              <div className="d-flex flex-col items-start ml-3">
                <p className="text-font-semibold  font-size-base">Delivered</p>
                <p className="text-font-regular  font-size-sm">
                  Successfully delivered
                </p>
              </div>
            </div>
            <div className="orderDetail-tracking-count d-flex flex-row mt-3">
              <div className="d-flex flex-col items-center">
                <div className="orderDetail-tracking-node-noIcon"></div>
              </div>
              <div className="d-flex flex-row text-font-regular font-size-base ml-2">
                <p>11:42</p>
                <p className="ml-2">07/30/2025</p>
              </div>
              <div className="d-flex flex-col items-start ml-3">
                <p className="text-font-semibold  font-size-base">In Transit</p>
                <p className="text-font-regular text-start font-size-sm">
                  Your order is on its way. Please keep your phone nearby.
                </p>
              </div>
            </div>
            <div className="orderDetail-tracking-count d-flex flex-row mt-3">
              <div className="d-flex flex-col items-center">
                <div className="orderDetail-tracking-node">
                  <img
                    src={ICONS.waitDelivery}
                    alt=""
                    className="orderDetail-tracking-node-icon orderDetail-tracking-node-icon-normal"
                  />
                </div>
              </div>

              <div className="d-flex flex-row text-font-regular font-size-base ml-2">
                <p>11:42</p>
                <p className="ml-2">07/30/2025</p>
              </div>
              <div className="d-flex flex-col items-start ml-3">
                <p className="text-font-semibold  font-size-base">
                  Preparing Shipment
                </p>
                <p className="text-font-regular text-start font-size-sm">
                  Seller is preparing your order.
                </p>
              </div>
            </div>
            <div className="orderDetail-tracking-count d-flex flex-row mt-3">
              <div className="d-flex flex-col items-center">
                <div className="orderDetail-tracking-node">
                  <img
                    src={ICONS.receipt}
                    alt=""
                    className="orderDetail-tracking-node-icon orderDetail-tracking-node-icon-normal"
                  />
                </div>
              </div>

              <div className="d-flex flex-row text-font-regular font-size-base ml-2">
                <p>11:42</p>
                <p className="ml-2">07/30/2025</p>
              </div>
              <div className="d-flex flex-col items-start ml-3">
                <p className="text-font-semibold  font-size-base">
                  Order Placed
                </p>
                <p className="text-font-regular font-size-sm text-start">
                  Your order has been placed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="orderDetail-line" />
      <div className="d-flex flex-col p-4">
        <div className="d-flex flex-row mt-3">
          <img src={IMAGES.happyForever1} alt="" height={60} width={120} />
          <div className="d-flex flex-col items-start width-fullsize ml-4 mt-2">
            <p className="text-font-semibold font-size-md text-uppercase">
              Hoa Xuan
            </p>
            <p className="text-font-regular font-size-base mt-2">
              Color :
              <span className="text-font-semibold text-capitalize">Black</span>
            </p>
            <p className="text-font-regular font-size-base mt-2">
              Size :
              <span className="text-font-semibold text-capitalize">S</span>
            </p>
            <p className="text-font-regular font-size-base mt-2">
              Quantity :<span className="text-font-semibold">1</span>
            </p>
          </div>
          <div className="d-flex flex-row items-end">
            <p className="text-font-light font-size-md">
              <s>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(150)}
              </s>
            </p>
            <p className="text-font-semibold font-size-md ml-3">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(100)}
            </p>
          </div>
        </div>
        <div className="orderDetail-line mt-3" />
        <div className="d-flex flex-row mt-3">
          <img src={IMAGES.happyForever1} alt="" height={60} width={120} />
          <div className="d-flex flex-col items-start width-fullsize ml-4 mt-2">
            <p className="text-font-semibold font-size-md text-uppercase">
              Hoa Xuan
            </p>
            <p className="text-font-regular font-size-base mt-2">
              Color :
              <span className="text-font-semibold text-capitalize">Black</span>
            </p>
            <p className="text-font-regular font-size-base mt-2">
              Size :
              <span className="text-font-semibold text-capitalize">S</span>
            </p>
            <p className="text-font-regular font-size-base mt-2">
              Quantity :<span className="text-font-semibold">1</span>
            </p>
          </div>
          <div className="d-flex flex-row items-end">
            <p className="text-font-light font-size-md">
              <s>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(150)}
              </s>
            </p>
            <p className="text-font-semibold font-size-md ml-3">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(100)}
            </p>
          </div>
        </div>
        <div className="orderDetail-line mt-3" />
        <table className="orderDetail-orders-summary-bordered text-font-regular font-size-base">
          <tbody className="">
            <tr>
              <td>Total price</td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(150)}
              </td>
            </tr>
            <tr>
              <td>Shipping fee</td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(15)}
              </td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>
                -
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(10)}
              </td>
            </tr>
            <tr className="text-font-semibold font-size-base">
              <td>Grand total</td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(190)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex flex-col items-end">
          <div className="d-flex flex-row justify-end mt-3">
            <p className="text-font-semibold font-size-base">
              Payment method:
            </p>
            <p className="text-font-regular font-size-base ml-3">
              Cash on Delivery (COD)
            </p>
          </div>
          <p className="text-font-light-italic font-size-base">Please pay ₫190,960 upon delivery.</p>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
