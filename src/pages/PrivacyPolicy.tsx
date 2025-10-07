import BottomNavigation from "@components/common/BottomNavigation";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import TopNavigation from "@components/common/TopNavigation";
import "@styles/pages/privacyPolicy.scss";
import { IMAGES } from "@constants/image";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PrivacyPolicy: React.FC = () => {
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
      <div className="privacyPolicy-header d-flex flex-column items-center justify-content-center height-fullsize">
        <div className="d-flex flex-col width-fullsize">
          <div className="mt-3 mr-3">
            <TopNavigation textColor="#ffffff" />
          </div>
          <div className=" d-flex flex-col items-center justify-center">
            <img src={IMAGES.whiteLogo} alt="logo" height={250} width={250} onClick={() => navigate('/')}/>
            <BottomNavigation className="privacyPolicy-header-navigation-bottom text-font-light font-size-base mt-3 mb-3" />
          </div>
        </div>
      </div>
      <div className="privacyPolicy">
        <div className="privacyPolicy-container d-flex flex-col items-start width-fullsize p-5">
          <p className="text-font-bold font-size-xl">Privacy Policy</p>
          <p className="text-font-regular-italic font-size-base text-start mt-2">
            Last Updated: 08/07/2025
          </p>
          <div className="d-flex flex-col items-start mt-3">
            <p className="text-font-regular font-size-base text-start">
              We value your privacy and are committed to protecting your
              personal information. This Privacy Policy explains how we collect,
              use, and safeguard your data when you visit our website or make a
              purchase.
            </p>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                1. Information We Collect
              </p>
              <p className="text-font-regular font-size-base text-start">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>
                  Personal Information: Name, email address, phone number,
                  shipping/billing address.
                </li>
                <li>
                  Payment Information: Payment method details (processed
                  securely by third-party providers).
                </li>
                <li>
                  Usage Data: IP address, browser type, pages visited, and
                  actions taken on our website.
                </li>
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                2. How We Use Your Information
              </p>
              <p className="text-font-regular font-size-base text-start">
                We use the collected information for purposes such as:
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>Providing and improving our services.</li>
                <li>Processing transactions and sending confirmations.</li>
                <li>Communicating with you about your account or orders.</li>
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                3. How We Protect Your Information
              </p>
              <p className="text-font-regular font-size-base text-start">
                We implement appropriate technical and organizational measures
                to protect your data against unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                4. Sharing Your Information
              </p>
              <p className="text-font-regular font-size-base text-start">
                We do not sell or rent your personal information. We may share
                data with:
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>
                  Trusted service providers to process payments, deliver orders,
                  or provide technical support.
                </li>
                <li>Authorities, if required by law.</li>
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                5. Cookies & Tracking Technologies
              </p>
              <p className="text-font-regular font-size-base text-start">
                We use cookies and similar technologies to enhance your browsing
                experience and analyze website traffic.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                6. Your Rights
              </p>
              <p className="text-font-regular font-size-base text-start">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>Access, correct, or delete your personal data.</li>
                <li>Opt out of marketing communications.</li>
                <li>Restrict or object to certain processing activities.</li>
              </ul>
            </div>
            <div className="mt-2">
              <p className="text-font-semibold font-size-base text-start">
                7. Changes to This Policy
              </p>
              <p className="text-font-regular font-size-base text-start">
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated “Last Updated” date.
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>Access, correct, or delete your personal data.</li>
                <li>Opt out of marketing communications.</li>
                <li>Restrict or object to certain processing activities.</li>
              </ul>
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
};
