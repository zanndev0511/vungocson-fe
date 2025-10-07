import authApi from "@api/services/authApi";
import Header from "@components/common/Header";
import Modal from "@components/common/Modal";
import { ICONS } from "@constants/icons";
import "@styles/pages/forgetPassword.scss";
import { Input } from "@components/common/Input";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "@components/common/Footer";

export const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isModal, setIsModal] = useState<boolean>(false);

  const [passwordValid, setPasswordValid] = useState({
    isLengthValid: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  type PassType = "new" | "confirm";

  const [isHidePass, setHidePass] = useState<Record<PassType, boolean>>({
    new: true,
    confirm: true,
  });

  const toggleHidePass = (field: PassType) => {
    setHidePass((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    setPasswordValid({
      isLengthValid: newPassword.length >= 8,
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!+,\-./:;&<="?@]/.test(newPassword),
    });
  }, [newPassword]);

  const validate = (): boolean => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (
      !passwordValid.isLengthValid ||
      !passwordValid.hasNumber ||
      !passwordValid.hasSpecialChar
    ) {
      newErrors.newPassword = "Password does not meet complexity requirements";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await authApi.resetPassword({ token, newPassword });
      setIsModal(true);
      setErrors({});
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrors({ newPassword: "Failed to reset password. Try again." });
      console.error();
      (err)
    }
  };

  return (
    <>
      <Header backgroundColor="black" />
      {isModal && (
        <div className="forgetPassword-modal d-flex justify-center items-center fullsize">
          <Modal
            onClose={() => setIsModal(false)}
            isCancel={false}
            isButton={false}
            children={
              <div className="d-flex flex-col items-center">
                <div className="d-flex flex-row items-center justify-start gap-2">
                  <div className="forgetPassword-done d-flex flex-col items-center justify-center">
                    <img
                      src={ICONS.done}
                      alt=""
                      className="forgetPassword-done-icon"
                    />
                  </div>
                  <p className="font-size-regular text-font-sm">
                    Your password has been reset successfully.
                  </p>
                </div>
                <button
                  className="forgetPassword-button mt-4"
                  onClick={() => navigate("/")}
                >
                  OK
                </button>
              </div>
            }
          />
        </div>
      )}

      <div className="forgetPassword d-flex flex-col items-center justify-center">
        <p className="text-font-semibold font-size-2xl text-uppercase">
          MY ACCOUNT
        </p>
        <div className="forgetPassword-form d-flex flex-col mt-3">
          <p className="forgetPassword-title text-font-regular font-size-base text-start">
            Enter a new password below.
          </p>

          <div className="d-flex flex-col items-center width-fullsize mt-4">
            <div className="forgetPassword-password d-flex flex-row items-center">
              <Input
                id="new_password"
                type={isHidePass.new ? "password" : "text"}
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <img
                src={isHidePass.new ? ICONS.eye : ICONS.eyeclosed}
                alt=""
                className="forgetPassword-password-eye"
                onClick={() => toggleHidePass("new")}
              />
            </div>

            <ul className="list-disc pl-6 text-font-regular font-size-sm text-start width-fullsize mt-2">
              <li
                className={
                  passwordValid.isLengthValid
                    ? "forgetPassword-input-correct"
                    : "forgetPassword-input-warning"
                }
              >
                Minimum 8 characters
              </li>
              <li
                className={
                  passwordValid.hasNumber
                    ? "forgetPassword-input-correct"
                    : "forgetPassword-input-warning"
                }
              >
                At least one number
              </li>
              <li
                className={
                  passwordValid.hasSpecialChar
                    ? "forgetPassword-input-correct"
                    : "forgetPassword-input-warning"
                }
              >
                At least one special character (!+,-./:;&lt;="?@)
              </li>
            </ul>
            {errors.newPassword && (
              <p className="text-red-500 text-font-regular font-size-sm text-start width-fullsize mt-2">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="forgetPassword-password d-flex flex-col items-center width-fullsize mt-4">
            <div className="forgetPassword-password d-flex flex-row items-center">
              <Input
                id="confirm_password"
                type={isHidePass.confirm ? "password" : "text"}
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img
                src={isHidePass.confirm ? ICONS.eye : ICONS.eyeclosed}
                alt=""
                className="forgetPassword-password-eye"
                onClick={() => toggleHidePass("confirm")}
              />
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-font-regular font-size-sm text-start width-fullsize mt-2">
                {errors.confirmPassword}
              </p>
            )}
            <button
              className="forgetPassword-button text-font-regular font-size-base text-uppercase mt-4"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};
