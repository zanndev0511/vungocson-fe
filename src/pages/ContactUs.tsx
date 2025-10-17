import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import "@styles/pages/contactUs.scss";
import React from "react";

export const ContactUs: React.FC = () => {
  return (
    <>
      <Header backgroundColor="black" />
      <div className="contactUs">
        <div className="contactUs-container d-flex flex-col items-start width-fullsize">
          <p className="text-font-bold font-size-xl text-start">
            Questions, Concerns, Comments? You talk, we listen.
          </p>
          <div className="d-flex flex-col items-start width-fullsize mt-3">
            <p className="text-font-regular font-size-base text-start">
              If you have any additional questions or comments, we would love to
              hear from you!
            </p>
            <div className="width-fullsize mt-2">
              <p className="text-font-regular font-size-base text-start">
                Submit your query using any of the methods below.
              </p>
              <div className="contactUs-info-wrap width-fullsize">
                <ul className="contactUs-info-list list-disc text-font-regular font-size-base text-start mt-2">
                  <li>
                    <span className="text-font-semibold">Email:</span>
                    <a
                      href="mailto:support@vungocandson.com"
                      className="contactUs-info ml-1"
                    >
                      support@vungocandson.com
                    </a>
                  </li>
                  <li>
                    <span className="text-font-semibold">Phone:</span>
                    <a href="tel:+84906505070" className="contactUs-info ml-1">
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
                  <li>
                    <span className="text-font-semibold">WhatsApp:</span>
                    <a
                      href="https://wa.me/84906505070"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contactUs-info ml-1"
                    >
                      +84 906505070
                    </a>
                  </li>
                  <li>
                    <span className="text-font-semibold">Zalo:</span>
                    <a
                      href="https://zalo.me/84906505070"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contactUs-info ml-1"
                    >
                      +84 906505070
                    </a>
                  </li>
                </ul>
              </div>
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
