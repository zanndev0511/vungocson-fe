import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import "@styles/pages/termAndCondition.scss";
import React from "react";

export const TermAndCondition: React.FC = () => {
  return (
    <>
      <Header backgroundColor="black" />

      <div className="termAndCondition">
        <div className="termAndCondition-container d-flex flex-col items-start width-fullsize">
          <p className="text-font-bold font-size-xl text-start">Terms and Conditions</p>
          <div className="d-flex flex-col items-start mt-3">
            <p className="text-font-regular font-size-base text-start">
              By accessing and purchasing from the official VUNGOC&SON website,
              you agree to the following terms:
            </p>
            <div className="termAndCondition-info-wrap width-fullsize mt-2">
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>
                  <span className="text-font-semibold">Authenticity:</span> All
                  products offered are original creations of VUNGOC&SON.
                </li>
                <li>
                  <span className="text-font-semibold">Orders:</span>
                  Each order is subject to acceptance and availability.
                </li>
                <li>
                  <span className="text-font-semibold">Pricing:</span> Prices
                  are displayed in local currency; taxes and duties may apply
                  for international orders.
                </li>
                <li>
                  <span className="text-font-semibold">Payment:</span> Full
                  payment is required at checkout through approved methods only.
                </li>
                <li>
                  <span className="text-font-semibold">Shipping:</span> Delivery
                  times may vary by destination; delays beyond our control may
                  occur.
                </li>
                <li>
                  <span className="text-font-semibold">Returns:</span> Eligible
                  returns are accepted under our Return & Exchange Policy.
                </li>
                <li>
                  <span className="text-font-semibold">
                    Intellectual Property:
                  </span>
                  All images, designs, and content belong exclusively to
                  VUNGOC&SON. Any reproduction is strictly prohibited.
                </li>
                <li>
                  <span className="text-font-semibold">Modifications:</span>
                  VUNGOC&SON reserves the right to update terms at any time
                  without prior notice.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
