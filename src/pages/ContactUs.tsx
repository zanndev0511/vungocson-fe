import BottomNavigation from "@components/common/BottomNavigation";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import TopNavigation from "@components/common/TopNavigation";
import "@styles/pages/contactUs.scss";
import { IMAGES } from "@constants/image";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ContactUs: React.FC = () => {
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
      <div className="contactUs-header d-flex flex-column items-center justify-content-center height-fullsize">
        <div className="d-flex flex-col width-fullsize">
          <div className="mt-3 mr-3">
            <TopNavigation textColor="#ffffff" />
          </div>
          <div className=" d-flex flex-col items-center justify-center">
            <img src={IMAGES.whiteLogo} alt="logo" height={250} width={250} onClick={() => navigate('/')}/>
            <BottomNavigation className="contactUs-header-navigation-bottom text-font-light font-size-base mt-3 mb-3" />
          </div>
        </div>
      </div>
      <div className="contactUs">
        <div className="contactUs-container d-flex flex-col items-start width-fullsize p-5">
          <p className="text-font-bold font-size-xl">
            Questions, Concerns, Comments? You talk, we listen.
          </p>
          <div className="d-flex flex-col items-start mt-3">
            <p className="text-font-regular font-size-base text-start">
              If you have any additional questions or comments, we would love to
              hear from you!
            </p>
            <div className="mt-2">
              <p className="text-font-regular font-size-base text-start">
                Submit your query using any of the methods below.
              </p>
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>
                  <span className="text-font-semibold">Email:</span>
                  <a
                    href="mailto:vungocson.design@gmail.com"
                    className="contactUs-info ml-1"
                  >
                    vungocson.design@gmail.com
                  </a>
                </li>   
                <li>
                  <span className="text-font-semibold">Phone:</span>
                  <a
                    href="tel:+84906505070"
                    className="contactUs-info ml-1"
                  >
                    +84 906 505 070
                  </a>
                </li>   
                <li>
                  <span className="text-font-semibold">Facebook:</span>
                  <a
                    href="https://www.facebook.com/vungocsonvietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contactUs-info ml-1"
                  >
                    https://www.facebook.com/vungocsonvietnam
                  </a>
                </li>   
                <li>
                  <span className="text-font-semibold">Instagram:</span>
                  <a
                    href="https://www.instagram.com/vungocsonofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contactUs-info ml-1"
                  >
                    https://www.instagram.com/vungocsonofficial/
                  </a>
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
