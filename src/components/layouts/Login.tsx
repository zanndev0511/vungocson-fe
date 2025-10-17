import authApi from "@api/services/authApi";
import { CheckBox } from "@components/common/CheckBox";
import { Input } from "@components/common/Input";
import { ICONS } from "@constants/icons";
import type { LoginForm, LoginProps } from "@interfaces/pages/login";
import "@styles/pages/login.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login: React.FC<LoginProps> = (props) => {
  const { isOpen, onClose } = props;

  const navigate = useNavigate();

  const [login, setLogin] = useState<LoginForm>({
    email: "",
    password: "",
    isRememberMe: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});
  const [isHidePass, setIsHidePass] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = <K extends keyof LoginForm>(
    field: K,
    value: LoginForm[K]
  ) => {
    setLogin((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginForm, string>> = {};

    if (!login.email) newErrors.email = "Please enter your email.";
    if (!login.password) newErrors.password = "Please enter your password.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload: LoginForm = { ...login };
      await authApi.login(payload);
      window.location.reload();

      if (onClose) onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to Login";
      const newErrors: Partial<Record<keyof LoginForm, string>> = {};

      if (message.toLowerCase().includes("email")) {
        newErrors.email = message;
      } else if (message.toLowerCase().includes("password")) {
        newErrors.password = message;
      } else {
        newErrors.email = message;
      }

      setErrors(newErrors);
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authApi
      .getProfile()
      .then((res) => {
        setLogin((prev) => ({ ...prev, email: res.email }));
      })
      .catch((err) => {
        console.error("No logged-in user", err);
      });
  }, []);

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
      className={`login-container ${
        isOpen ? "login-container-open" : "login-container-closed"
      }`}
      onClick={onClose}
    >
      <div className="login-header" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-end mt-4 mr-4 login-close-wrapper">
          <img
            src={ICONS.cancel}
            alt="close"
            height={20}
            width={20}
            className="text-color login-close-btn"
            onClick={onClose}
          />
        </div>
        <div className="login-content d-flex flex-col items-start">
          <p className="text-font-regular font-size-4xl">LOGIN</p>
          <div className="d-flex flex-col width-fullsize mt-3">
            <div className="width-fullsize">
              <Input
                id={"email"}
                type={"email"}
                label="email"
                value={login.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="d-flex flex-col">
              <div className="login-password d-flex flex-row justify-center items-center width-fullsize mt-3">
                <Input
                  id={"password"}
                  type={isHidePass ? "password" : "text"}
                  label="password"
                  value={login.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />

                <img
                  src={isHidePass ? ICONS.eye : ICONS.eyeclosed}
                  alt=""
                  className="login-password-eye"
                  onClick={() => setIsHidePass(!isHidePass)}
                />
              </div>
              {errors.password && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="d-flex flex-row justify-between items-center width-fullsize mt-3">
              <CheckBox
                titleBtn="Remember me"
                isCheck={login.isRememberMe}
                setIsCheck={(checked) => handleChange("isRememberMe", checked)}
                className="width-fullsize"
                classNameContainer="items-center width-fullsize"
              />
              <p
                className="login-password-forget text-font-regular text-end"
                onClick={() => navigate("/forget-password")}
              >
                Forget your password?
              </p>
            </div>
            <button
              className="login-button text-font-regular mt-4"
              onClick={handleLogin}
            >
              {loading ? "Loading..." : "LOGIN"}
            </button>
            <p className="text-font-regular font-size-sm mt-3">
              Don’t have an account?{" "}
              <span
                className="login-create text-font-semibold"
                onClick={() => navigate("/sign-up")}
              >
                Create account
              </span>
            </p>
            <div className="d-flex flex-row justify-center items-center">
              <div className="login-divider" />
              <p className="text-font-regular font-size-sm p-2">OR</p>
              <div className="login-divider" />
            </div>
            <div className="d-flex flex-col">
              <div
                className="login-button-facebook d-flex flex-row justify-center items-center width-fullsize"
                onClick={authApi.loginWithFacebook}
              >
                <img src={ICONS.facebook} alt="" />
                <p className="login-fontSize-base text-font-regular ml-3">
                  Continue with Facebook
                </p>
              </div>
              <div
                className="login-button-google d-flex flex-row justify-center items-center width-fullsize mt-3"
                onClick={authApi.loginWithGoogle}
              >
                <img src={ICONS.google} alt="" />
                <p className="login-fontSize-base text-font-regular ml-3">
                  Continue with Google
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
