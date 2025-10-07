import "@styles/pages/signUp.scss";
import React, { useState } from "react";
import { Input } from "@components/common/Input";
import { Select } from "@components/common/Select";
import Footer from "@components/common/Footer";
import { CheckBox } from "@components/common/CheckBox";
import { useNavigate } from "react-router-dom";
import { ICONS } from "@constants/icons";
import Header from "@components/common/Header";
import type { RegisterForm } from "@interfaces/pages/register";
import authApi from "@api/services/authApi";
import Modal from "@components/common/Modal";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isModal, setIsModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  const currentYear = new Date().getFullYear();
  const [day, setDay] = useState<string>("01");
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("01");
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterForm | "check", string>>
  >({});

  const [passwordValid, setPasswordValid] = useState({
    isLengthValid: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [users, setUsers] = useState<RegisterForm>({
    email: "",
    password: "",
    title: "",
    firstname: "",
    lastname: "",
    birthday: "",
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterForm | "check", string>> = {};
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!users.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(users.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!users.title) {
      newErrors.title = "Title is required";
    }
    if (!users.firstname) {
      newErrors.firstname = "First name is required";
    }
    if (!users.lastname) {
      newErrors.lastname = "Last name is required";
    }
    if (!isCheck) {
      newErrors.check =
        "You must agree to receive updates before creating an account.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordRules = (value: string) => {
    setPasswordValid({
      isLengthValid: value.length >= 8,
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleChange = <K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K]
  ) => {
    setUsers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateUser = async () => {
    if (!validate()) return;

    if (!validate()) return;

    if (
      !passwordValid.isLengthValid ||
      !passwordValid.hasNumber ||
      !passwordValid.hasSpecialChar
    ) {
      return;
    }

    if (users.password !== confirmPassword) {
      return;
    }

    try {
      setLoading(true);
      const formattedBirthday = `${year}-${month}-${day}`;

      const payload: RegisterForm = {
        ...users,
        birthday: formattedBirthday,
      };
      await authApi.register(payload);
      setIsModal(true)
      setNotification('Account created successfully. Please Login.')
      navigate("/");
    } catch (error: any) {
      setNotification(error.response?.data?.message || "Failed to create user")
      console.error("Create user failed", error);
    } finally {
      setLoading(false);
    }
  };

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

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (year: number, month: number): number => {
    if (month === 2) {
      return isLeapYear(year) ? 29 : 28;
    }

    const monthsWith30Days = [4, 6, 9, 11];
    return monthsWith30Days.includes(month) ? 30 : 31;
  };

  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => 1900 + i
  );

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const days = Array.from(
    { length: getDaysInMonth(year, parseInt(month)) },
    (_, i) => String(i + 1).padStart(2, "0")
  );

  const selectTitle: Array<[string, string]> = [
    ["Ms", "Ms"],
    ["Mr", "Mr"],
  ];

  return (
    <>
      <Header backgroundColor="black" />
      {isModal && (
              <div className="signUp-modal d-flex justify-center items-center fullsize">
                <Modal
                  onClose={() => setIsModal(false)}
                  isCancel={false}
                  isButton={false}
                  children={
                    <div className="d-flex flex-col items-center">
                      <div className="d-flex flex-row items-center justify-start gap-2">
                        <div className="signUp-modal-done d-flex flex-col items-center justify-center">
                          <img
                            src={ICONS.done}
                            alt=""
                            className="signUp-modal-done-icon"
                          />
                        </div>
                        <p className="font-size-regular text-font-sm">
                          {notification}
                        </p>
                      </div>
                      <button
                        className="signUp-modal-button mt-4"
                        onClick={() => navigate("/")}
                      >
                        OK
                      </button>
                    </div>
                  }
                />
              </div>
            )}
      <div className="signUp d-flex flex-col items-center">
        <div className="signUp-content d-flex flex-col justify-center items-center mt-5">
          <p className="text-font-semibold font-size-lg">CREATE ACCOUNT</p>
          <p className="signUp-content-title text-font-regular font-size-sm mt-2">
            Register an account with VUNGOC&SON to receive exclusive offers and
            enjoy a seamless shopping experience!
          </p>
          <div className="d-flex flex-col width-fullsize">
            <div className="signUp-content-input mt-3">
              <Input
                id={"email"}
                type={"email"}
                label={"Email"}
                value={users.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
              {errors.email && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="signUp-content-input mt-3">
              <div className="signUp-content-password d-flex flex-row justify-center items-center">
                <Input
                  id={"password"}
                  type={isHidePass.new ? "password" : "text"}
                  label={"Password"}
                  value={users.password}
                  onChange={(e) => {
                    handleChange("password", e.target.value);
                    checkPasswordRules(e.target.value);
                  }}
                  required
                />
                <img
                  src={isHidePass.new ? ICONS.eye : ICONS.eyeclosed}
                  alt=""
                  className="signUp-content-password-eye"
                  onClick={() => toggleHidePass("new")}
                />
              </div>

              <ul className="list-disc pl-6 text-font-regular font-size-sm text-start mt-2">
                <li
                  className={`${
                    !passwordValid.isLengthValid
                      ? "signUp-content-input-warning"
                      : "signUp-content-input-correct"
                  }`}
                >
                  Please enter at least 8 characters.
                </li>
                <li
                  className={`${
                    !passwordValid.hasNumber
                      ? "signUp-content-input-warning"
                      : "signUp-content-input-correct"
                  }`}
                >
                  Please enter at least one number.
                </li>
                <li
                  className={`${
                    !passwordValid.hasSpecialChar
                      ? "signUp-content-input-warning"
                      : "signUp-content-input-correct"
                  }`}
                >
                  Please enter one special character (!+,-./:;&lt;=&quot;?@).
                </li>
              </ul>
            </div>
            <div className="signUp-content-input mt-3">
              <div className="signUp-content-password d-flex flex-row justify-center items-center">
                <Input
                  id={"confirm-password"}
                  type={isHidePass.confirm ? "password" : "text"}
                  label={"Confirm Password"}
                  value={confirmPassword}
                  className={`${
                    users.password !== confirmPassword &&
                    "signUp-content-input-error"
                  }`}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <img
                  src={isHidePass.confirm ? ICONS.eye : ICONS.eyeclosed}
                  alt=""
                  className="signUp-content-password-eye"
                  onClick={() => toggleHidePass("confirm")}
                />
              </div>
              {users.password !== confirmPassword && (
                <ul className="list-disc pl-6 text-font-regular font-size-sm text-start mt-2">
                  <li className="signUp-content-input-warning">
                    Password and confirm password do not match.
                  </li>
                </ul>
              )}
            </div>
            <div className="signUp-content-input mt-3">
              <Select
                label="SELECT TITLE"
                required
                value={users.title}
                onChange={(e) => handleChange("title", e.target.value)}
                options={selectTitle}
              />
              {errors.title && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                  {errors.title}
                </p>
              )}
            </div>
            <div className="signUp-content-input mt-3">
              <Input
                id={"first-name"}
                type={"text"}
                label={"First Name"}
                value={users.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
                required
              />
              {errors.firstname && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                  {errors.firstname}
                </p>
              )}
            </div>
            <div className="signUp-content-input mt-3">
              <Input
                id={"last-name"}
                type={"text"}
                label={"Last Name"}
                value={users.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
                required
              />
              {errors.lastname && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                  {errors.lastname}
                </p>
              )}
            </div>
            <div className="signUp-content-input mt-3">
              <p className="signUp-content-label text-font-regular font-size-sm text-start">
                DATE OF BIRTH
                <span className="signUp-content-label-mandatory">*</span>
              </p>
              <div className="d-flex flex-row width-fullsize mt-2">
                <div className="width-fullsize">
                  <Select
                    placeholder="Month"
                    value={month.toString()}
                    onChange={(e) => setMonth(e.target.value)}
                    options={months.map((month) => [month, month])}
                  />
                </div>
                <div className="width-fullsize ml-2">
                  <Select
                    placeholder="Day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    options={days.map((day) => [day, day])}
                  />
                </div>
                <div className="width-fullsize ml-2">
                  <Select
                    placeholder="Year"
                    value={year.toString()}
                    onChange={(e) => setYear(Number(e.target.value))}
                    options={years.map((year) => [
                      year.toString(),
                      year.toString(),
                    ])}
                  />
                </div>
              </div>
            </div>
            <div className="signUp-content-checkbox d-flex flex-col mt-4">
              <CheckBox
                isCheck={isCheck}
                setIsCheck={() => setIsCheck(!isCheck)}
                className="signUp-content-checkbox-title"
                titleBtn={
                  "I would like to receive updates (including by email, SMS, MMS, social media, phone, physical letter) about VUNGOC&SON new activities, exclusive products, tailored services and to have a personalised client experience based on my interests."
                }
              />
              {errors.check && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                  {errors.check}
                </p>
              )}
              <p className="text-font-regular font-size-sm text-start mt-2">
                By choosing "Create my profile", you confirm that you agree to
                our{" "}
                <span
                  className="signUp-content-direct text-font-semibold"
                  onClick={() => navigate("/termsAndConditions/")}
                >
                  Terms of Use
                </span>
                 , that you have read and understood our 
                <span
                  className="signUp-content-direct text-font-semibold"
                  onClick={() => navigate("/privacy-policy/")}
                >
                  privacy policy
                </span>
                , and that you want to create your VUNGOC&SON profile.
              </p>
            </div>
          </div>

          <button
            className="signUp-content-button text-font-semibold font-size-sm mt-4"
            onClick={handleCreateUser}
          >
            {loading ? "LOADING..." : "CREATE ACCOUNT"}
          </button>
        </div>
      </div>

      <div className="width-fullsize mt-5">
        <Footer />
      </div>
    </>
  );
};
