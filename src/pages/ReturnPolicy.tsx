import BottomNavigation from "@components/common/BottomNavigation";
import TopNavigation from "@components/common/TopNavigation";
import { IMAGES } from "@constants/image";
import "@styles/pages/returnPolicy.scss";
import React, { useEffect, useState } from "react";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";
import { useNavigate } from "react-router-dom";

export const ReturnPolicy: React.FC = () => {
  const [showHeader, setShowHeader] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      {showHeader && (
        <div className="account-fixed-header d-flex flex-row justify-between items-center">
          <Header />
        </div>
      )}
      <div className="returnPolicy-header d-flex flex-column items-center justify-content-center height-fullsize">
        <div className="d-flex flex-col width-fullsize">
          <div className="mt-3 mr-3">
            <TopNavigation textColor="#ffffff" />
          </div>
          <div className=" d-flex flex-col items-center justify-center">
            <img src={IMAGES.whiteLogo} alt="logo" height={250} width={250} onClick={() => navigate('/')}/>
            <BottomNavigation className="returnPolicy-header-navigation-bottom text-font-light font-size-base mt-3 mb-3" />
          </div>
        </div>
      </div>
      <div className="returnPolicy">
        <div className="returnPolicy-container d-flex flex-col items-start width-fullsize p-5">
          <p className="text-font-bold font-size-xl">RETURN POLICY</p>
          <p className="text-font-regular-italic font-size-base text-start mt-2">
              Last Updated: 08/07/2025
            </p>
          <div className="d-flex flex-col items-start mt-3">
            <p className="text-font-regular font-size-base text-start">
              Thank you for shopping with us! We want you to be completely
              satisfied with your purchase. If for any reason you are not
              satisfied, you may return your item under the following
              conditions:
            </p>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                1. Return Period
              </p>
              <p className="text-font-regular font-size-base text-start">
                You may return your item within{" "}
                <span className="text-font-semibold">7 days</span> from the date
                of delivery.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                2. Conditions for Returns
              </p>
              <p className="text-font-regular font-size-base text-start">
                To be eligible for a return, the item must be:
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>Unused and in the same condition that you received it.</li>
                <li>In its original packaging.</li>
                <li>Accompanied by the receipt or proof of purchase.</li>
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                3. Non-returnable Items
              </p>
              <p className="text-font-regular font-size-base text-start">
                The following items cannot be returned:
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>Gift cards.</li>
                <li>Sale or clearance items.</li>
                <li>Personal care items (e.g. cosmetics, undergarments).</li>
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                4. Return Process
              </p>
              <p className="text-font-regular font-size-base text-start">
                To initiate a return, please contact our customer service at
                [your support email or phone]. Once your return is approved, we
                will provide instructions on how and where to send your package.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                5. Refunds
              </p>
              <p className="text-font-regular font-size-base text-start">
                Once your return is received and inspected, we will notify you
                of the approval or rejection of your refund. If approved, your
                refund will be processed to your original payment method within
                5–7 business days.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                6. Return Shipping
              </p>
              <p className="text-font-regular font-size-base text-start">
                You will be responsible for paying for your own shipping costs
                for returning your item unless the return is due to our error.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-regular font-size-base text-start">
                If you have any questions about our Return Policy, please
                contact us at .....
              </p>
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
