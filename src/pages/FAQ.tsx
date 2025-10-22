import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import React from "react";
import "@styles/pages/faq.scss";

export const FAQ: React.FC = () => {
  return (
    <>
      <Header backgroundColor="black" />
      <div className="faq">
          <p className="text-font-bold font-size-2xl text-start">FAQ</p>
        <div className="faq-container items-start width-fullsize mt-3">
          <div className="faq-section d-flex flex-col items-start">
            <p className="text-font-semibold font-size-lg text-start">
              Shipping & Returns
            </p>
            <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
              <li>
                <span className="text-font-semibold">
                  How long does delivery take?
                </span>
                <br />
                Delivery will be completed within 2 business days.
              </li>
              <li>
                <span className="text-font-semibold">
                  Does VUNGOC&SON offer international shipping?
                </span>
                <br />
                Yes, international shipping is available.
              </li>
              <li>
                <span className="text-font-semibold">
                  How are shipping fees calculated?
                </span>
                <br />
                Shipping costs vary depending on the value of your order.
              </li>
            </ul>
          </div>
          <div className="faq-section d-flex flex-col items-start">
            <p className="text-font-semibold font-size-lg text-start">
              Brand Experience
            </p>
            <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
              <li>
                <span className="text-font-semibold">
                  Can I book an appointment to visit the VUNGOC&SON showroom?
                </span>
                <br />
                To ensure the best experience, please schedule an appointment in
                advance with VUNGOC&SON.
              </li>
              <li>
                <span className="text-font-semibold">
                  Does the brand provide personal stylist or fashion
                  consultation services?
                </span>
                <br />
                Yes, upon request, depending on client needs.
              </li>
            </ul>
          </div>
          <div className="faq-section d-flex flex-col items-start">
            <p className="text-font-semibold font-size-lg text-start">
              Events & Fashion Shows
            </p>
            <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
              <li>
                <span className="text-font-semibold">
                  How can I receive updates about VUNGOC&SON shows?
                </span>
                <br />
                By becoming a VUNGOC&SON client, you will receive our latest
                event updates.
              </li>
              <li>
                <span className="text-font-semibold">
                  Are show tickets available for purchase, or are they by
                  invitation only?
                </span>
                <br />
                Show invitations are exclusively reserved for partners and VVIP
                clients.
              </li>
              <li>
                <span className="text-font-semibold">
                  How can press or influencers register to attend an event?
                </span>
                <br />
                Please contact us via email or inbox through the official
                VUNGOC&SON fanpage.
              </li>
            </ul>
          </div>
          <div className="faq-section d-flex flex-col items-start">
            <p className="text-font-semibold font-size-lg text-start">
              Contact & Partnerships
            </p>
            <ul className="list-disc pl-6 text-font-regular font-size-base text-start mt-2">
              <li>
                <span className="text-font-semibold">
                  Who should I contact for media or brand collaborations?
                </span>
                <br />
                Please email{" "}
                <a
                  href="mailto:support@vungocandson.com"
                  className="text-font-regular underline"
                >
                  support@vungocandson.com
                </a>{" "}
                for media or partnership discussions.
              </li>
              <li>
                <span className="text-font-semibold">
                  Does VUNGOC&SON offer career opportunities or collaborations?
                </span>
                <br />
                VUNGOC&SON operates independently but warmly welcomes potential
                partners to join us in our annual fashion shows and creative
                collaborations.
              </li>
              <li>
                <span className="text-font-semibold">
                  How can I reach customer service?
                </span>
                <br />
                Please contact us via hotline{" "}
                <span className="text-font-semibold">+84 906 505070</span> or
                message us on the official VUNGOC&SON fanpage.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
