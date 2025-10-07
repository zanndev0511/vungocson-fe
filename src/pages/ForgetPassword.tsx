import authApi from "@api/services/authApi";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import { Input } from "@components/common/Input";
import { ICONS } from "@constants/icons";
import "@styles/pages/forgetPassword.scss";
import { useState } from "react";

export const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSend, setIsSend] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      await authApi.forgotPassword({ email });
      setIsSend(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header backgroundColor="black" />
      {isSend ? (
        <div className="forgetPassword d-flex flex-col items-center justify-center">
          <div className="d-flex flex-row items-center justify-start gap-2">
            <div className="forgetPassword-done d-flex flex-col items-center justify-center">
              <img
                src={ICONS.done}
                alt=""
                className="forgetPassword-done-icon"
              />
            </div>
            <p className="text-font-regular font-size-sm text-start">
              Password reset email has been sent.
            </p>
          </div>
          <p className="forgetPassword-done-notify text-font-regular font-size-sm mt-3">
            A password reset email has been sent to the email address on file
            for your account, but may take several minutes to show up in your
            inbox. Please wait at least 10 minutes before attempting another
            reset.
          </p>
        </div>
      ) : (
        <div className="forgetPassword d-flex flex-col items-center justify-center">
          <p className="text-font-semibold font-size-2xl text-uppercase">
            MY ACCOUNT
          </p>
          <div className="forgetPassword-form d-flex flex-col mt-4">
            <p className="forgetPassword-title text-font-regular font-size-sm ">
              Forget your password? Please enter your email address. You will
              receive a link to create a new password via email.
            </p>
            <div className="d-flex flex-col items-center width-fullsize mt-4">
              <Input
                id="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <p className="text-font-regular font-size-sm text-start text-red-500 width-fullsize mt-2 ml-1">
                  {error}
                </p>
              )}
              <button
                className="forgetPassword-button text-font-regular font-size-base text-uppercase mt-4"
                onClick={handleSubmit}
              >
                Reset password
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};
