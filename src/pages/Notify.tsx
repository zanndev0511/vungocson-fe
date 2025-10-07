import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import { ICONS } from "@constants/icons";
import "@styles/pages/notify.scss";
import { useLocation } from "react-router-dom";

export const Notify: React.FC = () => {
  const location = useLocation();
  const { status } = location.state;
  return (
    <>
      <Header backgroundColor="black" />
      <div className="notify d-flex flex-col items-center gap-2">
        <div
          className={`notify-icon-container ${
            status === "success" ? "success" : "fail"
          } d-flex flex-row justify-center items-center`}
        >
          <img src={status === "success" ? ICONS.done : ICONS.cancel} alt="" />
        </div>
        <p className="notify-content-title text-font-bold">
          {status === "success" ? "Payment Successful!" : "Payment Failed"}
        </p>
        <div className="notify-content d-flex flex-col">
          <p className="text-font-regular font-size-base">
            {status === "success"
              ? "Thank you for shopping with us."
              : "Unfortunately, your payment could not be processed."}
          </p>
          <p className="text-font-regular font-size-base">
            {status === "success"
              ? "Please check your email for the invoice and order details."
              : "Please try again or use a different payment method."}
          </p>
          <p className="text-font-regular font-size-base">
            {status === "success"
              ? "We hope you enjoy your shopping experience with us!"
              : "If you have any questions, kindly check your email or contact our support team."}
          </p>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
