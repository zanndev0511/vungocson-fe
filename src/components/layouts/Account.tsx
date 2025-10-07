import authApi from "@api/services/authApi";
import usersApi from "@api/services/usersApi";
import { Input } from "@components/common/Input";
import Modal from "@components/common/Modal";
import { Select } from "@components/common/Select";
import { ICONS } from "@constants/icons";
import type {
  ChangePasswordForm,
  Notify,
  ProfileForm,
} from "@interfaces/pages/account";
import type { Users } from "@interfaces/pages/users";
import { Overview } from "@pages/Overview";
import "@styles/pages/account.scss";
import React, { useEffect, useState } from "react";

export const Account: React.FC = () => {
  type ModalType = "profile" | "email";
  type PassType = "current" | "new" | "confirm";
  const [showModal, setShowModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<ModalType>("profile");
  const [loading, setLoading] = useState<boolean>(false);
  const [notify, setNotify] = useState<Notify>({
    profile: { status: "", message: "" },
    password: { status: "", message: "" },
  });
  const [errorsInput, setErrorsInput] = useState<
    Partial<Record<keyof ProfileForm, string>>
  >({});
  const [changePassword, setChangePassword] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
  });

  const [profile, setProfile] = useState<ProfileForm>({
    lastname: "",
    firstname: "",
    title: "",
    birthday: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newPassValid, setNewPassValid] = useState({
    isLengthValid: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const isNewPassValid =
    newPassValid.isLengthValid &&
    newPassValid.hasNumber &&
    newPassValid.hasSpecialChar;

  const [isHidePass, setHidePass] = useState<Record<PassType, boolean>>({
    current: true,
    new: true,
    confirm: true,
  });

  const selectTitle: Array<[string, string]> = [
    ["Mrs", "Mrs"],
    ["Mr", "Mr"],
  ];

  const currentYear = new Date().getFullYear();
  const [day, setDay] = useState<number>();
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(1);

  const [user, setUser] = useState<Users & { name?: string }>();

  const removeVietnameseTones = (str: string | undefined) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileForm, string>> = {};

    if (!profile.firstname) {
      newErrors.firstname = "First Name is required";
    }
    if (!profile.lastname) {
      newErrors.lastname = "Last Name is required";
    }

    setErrorsInput(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeProfile = <K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K]
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangePassword = <K extends keyof ChangePasswordForm>(
    field: K,
    value: ChangePasswordForm[K]
  ) => {
    setChangePassword((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      let formattedBirthday = "";
      if (day !== undefined && month !== undefined && year !== undefined) {
        formattedBirthday = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
      }

      await usersApi.updateProfile(user!.id, {
        firstname: profile.firstname,
        lastname: profile.lastname,
        title: profile.title,
        birthday: formattedBirthday,
      });

      showNotify("profile", "success", "Update profile successfully!");
      fetchUser();
    } catch (err: any) {
      showNotify("profile", "fail", "Failed to update Profile!!");
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (
    key: "profile" | "password",
    status: Notify["profile"]["status"],
    message: string,
    duration: number = 5000
  ) => {
    setNotify((prev) => ({
      ...prev,
      [key]: { status, message },
    }));

    setTimeout(() => {
      setNotify((prev) => ({
        ...prev,
        [key]: { status: "", message: "" },
      }));
    }, duration);
  };

  const fetchUser = async () => {
    try {
      const userData = await authApi.getProfile();

      let formattedBirthday = "";
      if (userData.birthday) {
        const [y, m, d] = userData.birthday.split("-");
        formattedBirthday = `${m}/${d}/${y}`;
        setDay(Number(d));
        setMonth(Number(m));
        setYear(Number(y));
      }
      const fullUser = {
        ...userData,
        name: `${userData.firstname} ${userData.lastname}`.trim(),
        birthday: formattedBirthday,
      };

      setUser(fullUser);
      setProfile({
        firstname: userData.firstname,
        lastname: userData.lastname,
        title: userData.title,
        birthday: userData.birthday,
      });
    } catch (err) {
      console.error("Lỗi khi lấy user:", err);
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (!changePassword.currentPassword || !changePassword.newPassword) {
      showNotify("password", "fail", "Please fill in all password fields!");
      return;
    }

    if (changePassword.newPassword !== confirmPassword) {
      showNotify(
        "password",
        "fail",
        "New password and confirm password do not match!"
      );
      return;
    }

    if (!isNewPassValid) {
      showNotify(
        "password",
        "fail",
        "New password does not meet requirements!"
      );
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword({
        currentPassword: changePassword.currentPassword,
        newPassword: changePassword.newPassword,
      });

      showNotify("password", "success", "Password changed successfully!");

      setChangePassword({ currentPassword: "", newPassword: "" });
      setConfirmPassword("");
    } catch (err: any) {
      showNotify(
        "password",
        "fail",
        err.response?.data?.message || "Failed to change password!"
      );
    } finally {
      setLoading(false);
    }
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

  const yearOptions: [string, string][] = years.map((y) => [
    String(y),
    String(y),
  ]);

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const monthOptions: [string, string][] = months.map((m) => [m, m]);

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const dayOptions: [string, string][] = days.map((d) => [d, d]);

  const toggleHidePass = (field: PassType) => {
    setHidePass((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const validatePassword = (password: string) => {
    const lengthCheck = /.{8,}/;
    const numberCheck = /\d/;
    const specialCheck = /[!+,\-./:;<=>?@]/;

    return {
      isLengthValid: lengthCheck.test(password),
      hasNumber: numberCheck.test(password),
      hasSpecialChar: specialCheck.test(password),
    };
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {showModal && (
        <>
          {typeModal === "profile" ? (
            <Modal
              title="Profile"
              namebtn={loading ? "LOADING..." : "SAVE"}
              onClick={handleUpdateProfile}
              onClose={() => setShowModal(false)}
              children={
                <div className="d-flex flex-col text-font-regular font-size-sm gap-3 pl-4 pr-4">
                  {notify.profile.message && (
                    <div
                      className={`account-modal-input-notify ${
                        notify.profile.status === "success" ? "success" : "fail"
                      } d-flex flex-row justify-start`}
                    >
                      <p className="text-font-regular font-size-sm">
                        {notify.profile.message}
                      </p>
                    </div>
                  )}

                  <div className="d-flex flex-col">
                    <Input
                      id="firstname"
                      type="text"
                      label="First Name"
                      value={profile.firstname ?? ""}
                      onChange={(e) =>
                        handleChangeProfile("firstname", e.target.value)
                      }
                      required
                    />
                    {errorsInput.firstname && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                        {errorsInput.firstname}
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-col">
                    <Input
                      id={"lastname"}
                      type={"text"}
                      label="Last Name"
                      value={profile.lastname ?? ""}
                      onChange={(e) =>
                        handleChangeProfile("lastname", e.target.value)
                      }
                      required
                    />
                    {errorsInput.lastname && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                        {errorsInput.lastname}
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-col">
                    <Select
                      label="SELECT TITLE"
                      options={selectTitle}
                      value={profile.title}
                      onChange={(e) =>
                        handleChangeProfile("title", e.target.value)
                      }
                      required
                    />
                    {errorsInput.lastname && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                        {errorsInput.lastname}
                      </p>
                    )}
                  </div>

                  <div className="d-flex flex-col">
                    <div className="d-flex flex-row gap-3">
                      <Select
                        label="Month"
                        options={monthOptions}
                        value={
                          month !== undefined
                            ? String(month).padStart(2, "0")
                            : undefined
                        }
                        onChange={(e) => setMonth(Number(e.target.value))}
                        required
                      />
                      <Select
                        label="Day"
                        options={dayOptions}
                        value={
                          day !== undefined
                            ? String(day).padStart(2, "0")
                            : undefined
                        }
                        onChange={(e) => setDay(Number(e.target.value))}
                        required
                      />
                      <Select
                        label="Year"
                        options={yearOptions}
                        value={year !== undefined ? String(year) : undefined}
                        onChange={(e) => setYear(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>
              }
            />
          ) : (
            <Modal
              title="Login Details"
              namebtn={loading ? "LOADING..." : "SAVE"}
              onClose={() => setShowModal(false)}
              onClick={handleChangePasswordSubmit}
              children={
                <>
                  <div className="d-flex flex-col text-font-regular font-size-sm pl-4 pr-4">
                    {notify.password.message && (
                      <div
                        className={`account-modal-input-notify ${
                          notify.password.status === "success"
                            ? "success"
                            : "fail"
                        } d-flex flex-row justify-start mb-3`}
                      >
                        <p className="text-font-regular font-size-sm">
                          {notify.password.message}
                        </p>
                      </div>
                    )}
                    <div className="d-flex flex-col justify-center items-start">
                      <Input
                        id={"email"}
                        type={"email"}
                        label="Email"
                        value={user?.email}
                        required
                        readonly
                        className="account-modal-input-block"
                      />
                    </div>
                  </div>
                  <div className="account-modal-line mt-3" />
                  <div className="d-flex mt-3">
                    <p className="text-uppercase font-size-lg text-font-semibold text-start">
                      CHANGE PASSWORD
                    </p>
                  </div>

                  <div className="d-flex flex-col text-font-regular font-size-sm pl-4 pr-4">
                    <div className="d-flex flex-col justify-center items-start mt-3">
                      <div className="account-modal-input-password d-flex flex-row justify-center items-center">
                        <Input
                          id={"currentPass"}
                          type={isHidePass.current ? "password" : "text"}
                          label="Current Password"
                          onChange={(e) => {
                            handleChangePassword(
                              "currentPassword",
                              e.target.value
                            );
                          }}
                          required
                        />

                        <img
                          src={isHidePass.current ? ICONS.eye : ICONS.eyeclosed}
                          alt=""
                          className="account-modal-input-password-eye"
                          onClick={() => toggleHidePass("current")}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-col justify-center items-start mt-3">
                      <div className="d-flex flex-col justify-center items-start width-fullsize">
                        <div className="account-modal-input-password d-flex flex-row justify-center items-center">
                          <Input
                            id={"newPass"}
                            type={isHidePass.new ? "password" : "text"}
                            label="New Password"
                            required
                            className={`${
                              isNewPassValid ? "" : "account-modal-input-error"
                            }`}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleChangePassword("newPassword", value);
                              setNewPassValid(validatePassword(value));
                            }}
                          />

                          <img
                            src={isHidePass.new ? ICONS.eye : ICONS.eyeclosed}
                            alt=""
                            className="account-modal-input-password-eye"
                            onClick={() => toggleHidePass("new")}
                          />
                        </div>
                        <ul className="list-disc ml-4 text-start mt-2">
                          <li
                            className={`${
                              !newPassValid.isLengthValid &&
                              "account-modal-input-warning"
                            }`}
                          >
                            Please enter at least 8 characters
                          </li>
                          <li
                            className={`${
                              !newPassValid.hasNumber &&
                              "account-modal-input-warning"
                            }`}
                          >
                            Please enter at least one number
                          </li>
                          <li
                            className={`${
                              !newPassValid.hasSpecialChar &&
                              "account-modal-input-warning"
                            }`}
                          >
                            Please enter one special character (!+,-./:;{"<"}=
                            {">"}?@)
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="d-flex flex-col justify-center items-start mt-3">
                      <div className="account-modal-input-password d-flex flex-row justify-center items-center">
                        <Input
                          id={"confirmPass"}
                          type={isHidePass.confirm ? "password" : "text"}
                          label="Confirm Password"
                          required
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`${
                            changePassword.newPassword !== confirmPassword &&
                            "account-modal-input-error"
                          }`}
                        />
                        <img
                          src={isHidePass.confirm ? ICONS.eye : ICONS.eyeclosed}
                          alt=""
                          className="account-modal-input-password-eye"
                          onClick={() => toggleHidePass("confirm")}
                        />
                      </div>
                      {changePassword.newPassword !== confirmPassword && (
                        <ul className="list-disc ml-4 text-start mt-2">
                          <li className="account-modal-input-warning">
                            New password and confirm password do not match.
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              }
            />
          )}
        </>
      )}
      <Overview
        activeNumber={0}
        content={
          <div className="account d-flex flex-col items-start width-fullsize">
            <p className="text-font-bold font-size-xl">MY ACCOUNT</p>
            <div className="d-flex flex-col justify-center items-center width-fullsize">
              <div className="account-box d-flex flex-col width-fullsize p-4 mt-4">
                <p className="text-start text-font-bold font-size-lg">
                  Profile
                </p>
                <div
                  className="account-box-edit"
                  onClick={() => {
                    setShowModal(true);
                    setTypeModal("profile");
                  }}
                >
                  <img src={ICONS.edit} alt="" />
                </div>
                <div className="mt-3">
                  <div className="d-flex flex-row">
                    <div className="d-flex flex-row">
                      <p className="account-label text-font-semibold font-size-base text-start">
                        Name:
                      </p>
                      <p className="text-font-regular font-size-base text-start">
                        {removeVietnameseTones(user?.name)}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex flex-row mt-2">
                    <p className="account-label text-font-semibold font-size-base text-start">
                      Title:
                    </p>
                    <p className="text-font-regular font-size-base text-start">
                      {user?.title}
                    </p>
                  </div>
                  <div className="d-flex flex-row mt-2">
                    <p className="account-label text-font-semibold font-size-base text-start">
                      Date of birth:
                    </p>
                    <p className="text-font-regular font-size-base text-start">
                      {user?.birthday}
                    </p>
                  </div>
                </div>
              </div>
              <div className="account-box d-flex flex-col width-fullsize p-4 mt-4">
                <p className="text-start text-font-bold font-size-lg">
                  Email & Password
                </p>
                <div
                  className="account-box-edit"
                  onClick={() => {
                    setShowModal(true);
                    setTypeModal("email");
                  }}
                >
                  <img src={ICONS.edit} alt="" />
                </div>
                <div className="mt-3">
                  <div className="d-flex flex-row mt-2">
                    <p className="account-label text-font-semibold font-size-base text-start">
                      Email:
                    </p>
                    <p className="account-label-value text-font-regular font-size-base text-start">
                      {user?.email}
                    </p>
                  </div>
                  <div className="d-flex flex-row mt-2">
                    <p className="account-label text-font-semibold font-size-base text-start">
                      Password:
                    </p>
                    <p className="text-font-regular font-size-base text-start">
                      ***********
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};
