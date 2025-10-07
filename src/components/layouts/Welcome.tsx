import authApi from "@api/services/authApi";
import { ICONS } from "@constants/icons";
import type { WelcomeProps } from "@interfaces/pages/welcome";
import "@styles/pages/welcome.scss";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Welcome: React.FC<WelcomeProps> = (props) => {
  const { isOpen, onClose } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  const removeVietnameseTones = (str: string | undefined) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const fetchUserEmail = async () => {
    try {
      const user = await authApi.getProfile();

      const email = user.email;
      const username = email.split("@")[0];
      setEmail(username!);
    } catch (err) {
      console.error("Lỗi khi lấy user:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setEmail("");
      window.location.href = "/";
      Cookies.remove("name");
      Cookies.remove("accessToken");

      if (onClose) onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to Logout");
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    fetchUserEmail();
  }, []);

  return (
    <div
      className={`welcome-container ${isOpen ? "open" : "closed"}`}
      onClick={onClose}
    >
      <div className="welcome-header" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-end mt-4 mr-4 welcome-close-wrapper">
          <img
            src={ICONS.cancel}
            alt="close"
            height={20}
            width={20}
            className="text-color welcome-close-btn"
            onClick={onClose}
          />
        </div>
        <div className="d-flex flex-col items-start fullsize pl-4 pr-4 mt-5">
          <p className="text-font-semibold font-size-3xl text-start ">
            WELCOME,
          </p>
          <p className="text-font-regular font-size-3xl text-start text-uppercase">
            {removeVietnameseTones(email)}
          </p>
          <p className="text-font-regular font-size-sm text-start">
            Access your account to review recent orders, manage shipping and
            billing addresses, and update your password and account information.
          </p>
          <button
            className="welcome-button text-font-regular font-size-sm text-uppercase width-fullsize mt-4"
            onClick={() => navigate("/me/account")}
          >
            GO TO MY ACCOUNT
          </button>
          <div className="d-flex flex-row gap-2 mt-2">
            <p className="text-font-regular font-size-sm text-start">
              You are logged in as {removeVietnameseTones(email)}.
            </p>
            <p
              className="welcome-button-logout text-font-regular font-size-sm text-start"
              onClick={handleLogout}
            >
              (Logout)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
