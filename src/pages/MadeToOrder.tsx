import React, { useEffect, useState } from "react";
import { IMAGES } from "@constants/image";
import "@styles/pages/madeToOrder.scss";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import Modal from "@components/common/Modal";
import countryCallingCodes from "country-calling-code";
import { Input } from "@components/common/Input";
import type { MadeToOrderForm } from "@interfaces/pages/madeToOrder";
import madeToOrderApi from "@api/services/madeToOrderApi";
import { toast } from "react-toastify";
import { Select } from "@components/common/Select";
import { TextArea } from "@components/common/TextArea";

export const MadeToOrder: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MadeToOrderForm, string>>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [madeToOrder, setMadeToOrder] = useState<MadeToOrderForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCode: "",
    contactTime: "",
    message: "",
    socialMedia: "",
  });
  const selectTime: Array<[string, string]> = [
    ["any", "Any time"],
    ["9-12", "9 AM – 12 AM"],
    ["12-15", "12 PM – 3 PM"],
    ["15-18", "3 PM – 6 PM"],
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MadeToOrderForm, string>> = {};

    if (!madeToOrder.firstName)
      newErrors.firstName = "Please enter your first name.";
    if (!madeToOrder.lastName)
      newErrors.lastName = "Please enter your last name.";
    if (!madeToOrder.email) newErrors.email = "Please enter your email.";
    if (!madeToOrder.phone && !madeToOrder.phoneCode)
      newErrors.phone = "Please enter your phone.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await madeToOrderApi.create({
        firstName: madeToOrder.firstName,
        lastName: madeToOrder.lastName,
        email: madeToOrder.email,
        phoneCode: madeToOrder.phoneCode,
        phone: madeToOrder.phone,
        contactTime: madeToOrder.contactTime,
        message: madeToOrder.message,
        socialMedia: madeToOrder.socialMedia,
      });
      setShowModal(false)
      toast.success("Your appointment has been booked successfully. We will get in touch with you soon, please stay tuned.", {
        className: "result-toast text-font-regular font-size-sm",
        autoClose: 5000,
        position: "top-center",
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Book an Apointment fail. Please try again.", {
        className: "result-toast text-font-regular font-size-sm",
        autoClose: 5000,
        position: "top-center",
      });
    }
  };

  const handleChange = <K extends keyof MadeToOrderForm>(
    field: K,
    value: MadeToOrderForm[K]
  ) => {
    setMadeToOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
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
  return (
    <>
      {showModal && (
        <div className="madeToOrder-modal d-flex justify-center text-font-regular items-center fullsize">
          <Modal
            title="MADE-TO-ORDER"
            description="To begin crafting your exclusive VUNGOC&SON piece, please complete the form below. Our team will reach out promptly to guide you through the next steps."
            namebtn={loading ? "Loading..." : "BOOK AN APPOINTMENT"}
            onClick={handleSubmit}
            onClose={() => setShowModal(false)}
            children={
              <div className="d-flex flex-col gap-3">
                <div className="d-flex flex-row gap-3">
                  <div className="d-flex flex-col width-fullsize">
                    <Input
                      id={"firstname"}
                      type="text"
                      label={"First Name"}
                      value={madeToOrder.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      required
                    />
                    {errors.firstName && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-col width-fullsize">
                    <Input
                      id={"lastname"}
                      type="text"
                      label={"Last Name"}
                      value={madeToOrder.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                    {errors.lastName && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-col width-fullsize">
                  <Input
                    id={"email"}
                    type="email"
                    label={"Email"}
                    value={madeToOrder.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                  {errors.email && (
                    <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="d-flex flex-col gap-3 width-fullsize">
                  <div className="d-flex flex-row gap-3 width-fullsize">
                    <div className="madeToOrder-modal-input-phoneCode">
                      <Select
                        label="PHONE CODE"
                        value={madeToOrder.phoneCode}
                        options={countryCallingCodes.map((c) => [
                          `+${c.countryCodes[0]}`,
                          `${c.isoCode2} (+${c.countryCodes[0]})`,
                        ])}
                        onChange={(e) =>
                          handleChange("phoneCode", e.target.value)
                        }
                      />
                    </div>

                    <Input
                      id={"phone"}
                      type="phone"
                      label={"Phone"}
                      value={madeToOrder.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="d-flex flex-col width-fullsize">
                  <Input
                    id={"social"}
                    type={"url"}
                    label={"Social Media Contact"}
                    value={madeToOrder.socialMedia}
                    onChange={(e) =>
                      handleChange("socialMedia", e.target.value)
                    }
                  />
                </div>
                <div className="d-flex flex-col width-fullsize">
                  <Select
                    label={"PREFERRED CONTACT TIME"}
                    value={madeToOrder.contactTime}
                    options={selectTime}
                    onChange={(e) =>
                      handleChange("contactTime", e.target.value)
                    }
                  />
                </div>
                <div className="d-flex flex-col width-fullsize">
                  <TextArea
                    id={"message"}
                    label={"MESSAGE"}
                    value={madeToOrder.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                  />
                </div>
              </div>
            }
          />
        </div>
      )}

      <Header backgroundColor="black" />
      <div className="madeToOrder d-flex flex-col justify-center items-center p-5">
        <p className="text-font-semibold font-size-xl">MADE TO ORDER</p>
        <div className="text-font-light font-size-sm mt-4">
          <p>
            Discover a bespoke, made-to-order experience crafted to bring your
            unique vision to life. Our exclusive service allows you to turn your
            favorite garments and silhouettes into one-of-a-kind gowns, tailored
            precisely to your individual style. We meticulously source premium
            fabrics from suppliers worldwide who meet our exceptional standards
            for quality, ensuring each piece embodies elegance and refinement.
          </p>
          <p className="mt-3">
            With this blend of luxurious materials and unparalleled
            craftsmanship, we are committed to delivering a made-to-order
            experience that captures and celebrates your unique tastes and
            desires. Trust us to fulfill your vision with exceptional quality,
            tailored just for you.
          </p>
        </div>
        <div className="mt-4">
          <img src={IMAGES.madeToOrder} alt=" " height={1200} width={800} />
        </div>
        <button
          className="madeToOrder-button text-font-light p-2 m-4"
          onClick={() => setShowModal(true)}
        >
          BOOK AN APPOINTMENT
        </button>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};
