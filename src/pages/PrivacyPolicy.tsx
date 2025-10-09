import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import "@styles/pages/privacyPolicy.scss";
import React from "react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Header backgroundColor="black" />
      <div className="privacyPolicy">
        <div className="privacyPolicy-container d-flex flex-col items-start width-fullsize">
          <p className="text-font-bold font-size-xl text-start">Privacy Policy</p>
          <div className="d-flex flex-col items-start mt-3">
            <p className="text-font-regular font-size-base text-start">
              At VUNGOC&SON, we value your trust and are committed to protecting
              your personal information.
            </p>
            <div className="mt-2">
              <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
                <li>
                  <span className="text-font-semibold">Collection:</span> Only
                  essential information is collected to deliver a seamless
                  shopping and client experience.
                </li>
                <li>
                  <span className="text-font-semibold">Use:</span> Data is used
                  exclusively for order processing, client care, and brand
                  communications.
                </li>
                <li>
                  <span className="text-font-semibold">Confidentiality:</span>{" "}
                  Personal information is never sold or shared, except when
                  required by law or trusted service partners.
                </li>
                <li>
                  <span className="text-font-semibold">Security:</span> We apply
                  strict measures to safeguard your data.
                </li>
                <li>
                  <span className="text-font-semibold">Rights:</span> Clients
                  may request access, correction, or deletion of their data at
                  any time.
                </li>
                <li>
                  <span className="text-font-semibold">Updates:</span> This
                  policy may be refined to reflect new practices or legal
                  requirements.
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
