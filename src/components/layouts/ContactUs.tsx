import { Button } from "@components/common/Button";
import { ICONS } from "@constants/icons";
import { ContactUsProps } from "@interfaces/pages/contactUs";
import "@styles/pages/contactUs.scss";
import { useEffect } from "react";
export const ContactUs: React.FC<ContactUsProps> = (props) => {
  const { isOpen, onClose } = props;
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <div
      className={`contactUs-layout-container ${
        isOpen
          ? "contactUs-layout-container-open"
          : "contactUs-layout-container-closed"
      }`}
    >
      <div className="contactUs-layout-header">
        <div
          className="contactUs-layout-close-wrapper d-flex justify-end mt-4 mr-4"
          onClick={onClose}
        >
          <img
            src={ICONS.cancel}
            alt="close"
            height={20}
            width={20}
            className="contactUs-layout-close-btn text-color"
          />
        </div>
        <div className="d-flex flex-col items-start pl-4 pr-4">
          <p className="text-font-semibold font-size-xl text-uppercase">
            Contact us
          </p>
          <div className="d-flex flex-col gap-10 mt-2 p-4">
            <div className="d-flex flex-col gap-3">
              <div className="d-flex flex-row items-center gap-2">
                <img
                  src={ICONS.phone}
                  alt=""
                  className="contactUs-layout-icon"
                />
                <Button
                  label="Call Us +84906 505 070"
                  variant="static-underline"
                  className="font-size-sm"
                  onClick={() => (window.location.href = "tel:+84906505070")}
                />
              </div>
              <p className="text-font-regular font-size-xs text-start">
                Available Monday to Sunday, 10:00 AM – 8:00 PM (GMT+7, Vietnam
                Time).
              </p>
            </div>
            <div className="d-flex flex-col gap-3">
              <div className="d-flex flex-row items-center gap-2">
                <img
                  src={ICONS.mail}
                  alt=""
                  className="contactUs-layout-icon"
                />
                <Button
                  label="Mail Us"
                  variant="static-underline"
                  className="font-size-sm"
                  onClick={() =>
                    (window.location.href = "mailto:vungocson.design@gmail.com")
                  }
                />
              </div>
              <p className="text-font-regular font-size-xs text-start">
                For email inquiries, we are available 24/7.
              </p>
            </div>
            <div className="d-flex flex-col gap-3">
              <div className="d-flex flex-row items-center gap-2">
                <img
                  src={ICONS.facebook}
                  alt=""
                  className="contactUs-layout-icon social"
                />
                <Button
                  label="Facebook"
                  variant="static-underline"
                  className="font-size-sm"
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/vungocsonvietnam",
                      "_blank"
                    )
                  }
                />
              </div>
              <p className="text-font-regular font-size-xs text-start">
                Connect with us on Facebook — available 24/7.
              </p>
            </div>
            <div className="d-flex flex-col gap-3">
              <div className="d-flex flex-row items-center gap-2">
                <img
                  src={ICONS.instagram}
                  alt=""
                  className="contactUs-layout-icon social"
                />
                <Button
                  label="Instagram"
                  variant="static-underline"
                  className="font-size-sm"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/vungocsonofficial/",
                      "_blank"
                    )
                  }
                />
              </div>
              <p className="text-font-regular font-size-xs text-start">
                Connect with us on Instagram — available 24/7.
              </p>
            </div>
            <div className="d-flex flex-col gap-3">
              <div className="d-flex flex-row items-center gap-2">
                <img
                  src={ICONS.wechat}
                  alt=""
                  className="contactUs-layout-icon social"
                />
                <Button
                  label="Wechat"
                  variant="static-underline"
                  className="font-size-sm"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/vungocsonofficial/",
                      "_blank"
                    )
                  }
                />
              </div>
              <p className="text-font-regular font-size-xs text-start">
                Connect with us on Wechat — available 24/7.
              </p>
            </div>
            <p className="text-font-regular font-size-sm text-start">
              Still have questions? Contact us anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
