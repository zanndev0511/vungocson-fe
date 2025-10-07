import BottomNavigation from '@components/common/BottomNavigation';
import Footer from '@components/common/Footer';
import Header from '@components/common/Header';
import TopNavigation from '@components/common/TopNavigation';
import "@styles/pages/termAndCondition.scss";
import { IMAGES } from '@constants/image';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const TermAndCondition: React.FC = () => {
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
      <div className="termAndCondition-header d-flex flex-column items-center justify-content-center height-fullsize">
        <div className="d-flex flex-col width-fullsize">
          <div className="mt-3 mr-3">
            <TopNavigation textColor="#ffffff" />
          </div>
          <div className=" d-flex flex-col items-center justify-center">
            <img src={IMAGES.whiteLogo} alt="logo" height={250} width={250} onClick={() => navigate('/')}/>
            <BottomNavigation className="termAndCondition-header-navigation-bottom text-font-light font-size-base mt-3 mb-3" />
          </div>
        </div>
      </div>
      <div className="termAndCondition">
        <div className="termAndCondition-container d-flex flex-col items-start width-fullsize p-5">
          <p className="text-font-bold font-size-xl">Terms and Conditions</p>
          <p className="text-font-regular-italic font-size-base text-start mt-2">
            Last Updated: 08/07/2025
          </p>
          <div className="d-flex flex-col items-start mt-3">
            <p className="text-font-regular font-size-base text-start">
              Welcome to our website. By accessing or using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
            </p>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                1. Acceptance of Terms
              </p>
              <p className="text-font-regular font-size-base text-start">
                By visiting our site, placing an order, or using our services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                2. Eligibility
              </p>
              <p className="text-font-regular font-size-base text-start">
                You must be at least 18 years old or have legal parental/guardian consent to use our services.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                3. Products and Services
              </p>
              <p className="text-font-regular font-size-base text-start">
                We strive to ensure that all product descriptions, images, and prices are accurate. However, we reserve the right to correct errors, update information, and change or discontinue products at any time without prior notice.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                4. Orders and Payments
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>All orders are subject to acceptance and availability.</li>
                <li>Prices are displayed in dollar and include/exclude taxes as stated.</li>
                <li>Payment must be made in full before shipment.</li>
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                5. Shipping and Delivery
              </p>
              <p className="text-font-regular font-size-base text-start">
               We aim to deliver orders promptly, but delivery times are estimates only. We are not responsible for delays beyond our control.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                6. Returns and Refunds
              </p>
              <p className="text-font-regular font-size-base text-start">
                Our return policy is outlined in our [Return Policy] page. Please review it before making a purchase.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                7. Intellectual Property
              </p>
              <p className="text-font-regular font-size-base text-start">
                All content, designs, and trademarks on this website are the property of [Your Company Name] and may not be reproduced without our written consent.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-regular font-size-base text-start">
                If you have any questions about our Privacy Policy, please
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
}
