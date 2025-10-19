import { ICONS } from "@constants/icons";
import { IMAGES } from "@constants/image";
import "@styles/components/customToOrder.scss";
import { useEffect, useState } from "react";
import { Input } from "./Input";
import type {
  CustomSizeOrderForm,
  CustomSizeOrderMeasurements,
  CustomToOrderProps,
} from "@interfaces/components/customToOrder";
import { Select } from "./Select";
import { TextArea } from "./TextArea";
import { CheckBox } from "./CheckBox";
import type { NotifyItem } from "@interfaces/pages/account";
import countryCallingCodes from "country-calling-code";
import madeToOrderApi from "@api/services/madeToOrderApi";
export const CustomToOrder: React.FC<CustomToOrderProps> = (props) => {
  const { productName, productPrice, productCategories, isOpen, onClose } =
    props;
  const measureUnitOptions: [string, string][] = [
    ["cm", "CM"],
    ["in", "IN"],
  ];

  const [step, setStep] = useState<number>(0);
  const [isCheckAgree, setIsCheckAgree] = useState<boolean>(false);
  const [checkboxError, setCheckboxError] = useState<string>("");
  const [notify, setNotify] = useState<NotifyItem | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomSizeOrderForm, string>>
  >({});
  const [customOrder, setCustomOrder] = useState<CustomSizeOrderForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "",
    phone: "",
    contactTime: "",
    measurementUnit: "cm",
    message: "",
    socialMedia: "",
    customSizeOrder: {
      nameProduct: "",
      height: 0,
      weight: 0,
      bust: 0,
      waist: 0,
      hips: 0,
      shoulderWidth: 0,
      armLength: 0,
      neckCircumference: 0,
    },
  });

  const selectTime: Array<[string, string]> = [
    ["any", "Any time"],
    ["9-12", "9 AM – 12 AM"],
    ["12-15", "12 PM – 3 PM"],
    ["15-18", "3 PM – 6 PM"],
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomSizeOrderForm, string>> = {};

    if (step === 0) {
      if (!customOrder.firstName)
        newErrors.firstName = "Please enter your first name.";
      if (!customOrder.lastName)
        newErrors.lastName = "Please enter your last name.";
      if (!customOrder.email) newErrors.email = "Please enter your email.";
      if (!customOrder.phone && !customOrder.phoneCode)
        newErrors.phone = "Please enter your phone.";
      if (!customOrder.contactTime)
        newErrors.contactTime = "Prefered Delivery Date is required";
    }

    if (step === 2) {
      if (!isCheckAgree) {
        setCheckboxError(
          "You must agree to the Terms & Conditions before proceeding."
        );
        return false;
      } else {
        setCheckboxError("");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleChange = <K extends keyof CustomSizeOrderForm>(
    field: K,
    value: CustomSizeOrderForm[K]
  ) => {
    setCustomOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomSizeChange = <K extends keyof CustomSizeOrderMeasurements>(
    field: K,
    value: CustomSizeOrderMeasurements[K]
  ) => {
    setCustomOrder((prev) => ({
      ...prev,
      customSizeOrder: {
        ...prev.customSizeOrder,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!validate() || !isCheckAgree) return;

    try {
      await madeToOrderApi.create({
        firstName: customOrder.firstName,
        lastName: customOrder.lastName,
        email: customOrder.email,
        phoneCode: customOrder.phoneCode,
        phone: customOrder.phone,
        contactTime: customOrder.contactTime,
        message: customOrder.message,
        socialMedia: customOrder.socialMedia,
        customSizeOrder: {
          nameProduct: productName,
          height: customOrder.customSizeOrder.height,
          weight: customOrder.customSizeOrder.weight,
          bust: customOrder.customSizeOrder.bust,
          waist: customOrder.customSizeOrder.waist,
          hips: customOrder.customSizeOrder.hips,
          shoulderWidth: customOrder.customSizeOrder.shoulderWidth,
          armLength: customOrder.customSizeOrder.armLength,
          neckCircumference: customOrder.customSizeOrder.neckCircumference,
        },
      });
      setNotify({
        status: "success",
        message:
          "Your order has been submitted. We will get in touch with you soon, please stay tuned.",
      });
      setTimeout(() => setNotify(null), 5000);
    } catch (error) {
      console.error(error);
      setNotify({
        status: "fail",
        message:
          "We’re sorry, but we couldn’t submit your order at the moment. Please try again later.",
      });
      setTimeout(() => setNotify(null), 5000);
    }
  };

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
    <>
      {isOpen && (
        <div className="customToOrder" onClick={onClose}>
          <div
            className="customToOrder-container d-flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="customToOrder-header width-fullsize">
              <img src={IMAGES.blackLogo} alt="" height={150} width={150} />
              <img
                src={ICONS.cancel}
                alt=""
                className="customToOrder-header-cancel"
                onClick={onClose}
              />
            </div>
            <div className="customToOrder-content gap-10 mt-4">
              <div className="customToOrder-content-detail d-flex flex-col items-center fullsize">
                <img
                  src={
                    productCategories?.some(
                      (cat) => cat.toLowerCase() === "men"
                    )
                      ? IMAGES.manModel
                      : IMAGES.womanModal
                  }
                  alt=""
                />
              </div>
              <div className="customToOrder-content-image d-flex flex-col items-center width-fullsize">
                <div className="d-flex flex-col width-fullsize">
                  <p className="text-font-semibold font-size-base text-start">
                    {productName}
                  </p>
                  <p className="text-font-regular font-size-sm text-start">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(productPrice)}
                  </p>
                </div>
                <div className="d-flex flex-col mt-4">
                  <p className="text-font-regular font-size-sm text-start text-uppercase">
                    MADE-TO-MEASURE
                  </p>
                  <p className="text-font-light-italic font-size-xs text-start mt-2">
                    Measure your body with a sewing tape measure. You may need
                    the help of another person for certain points.
                  </p>
                  <div className="d-flex flex-col mt-2">
                    <p className="text-font-semibold font-size-xs text-start">
                      1. BUST
                    </p>
                    <p className="text-font-regular font-size-xs text-start">
                      Measure under your arms, around the fullest part of your
                      chest.
                    </p>
                  </div>
                  <div className="d-flex flex-col mt-1">
                    <p className="text-font-semibold font-size-xs text-start">
                      2. WAIST
                    </p>
                    <p className="text-font-regular font-size-xs text-start">
                      Measure around you natural wasteline, below your rib cage, leaving the tape a bit loose.
                    </p>
                  </div>
                  <div className="d-flex flex-col mt-1">
                    <p className="text-font-semibold font-size-xs text-start">
                      3. HIPS
                    </p>
                    <p className="text-font-regular font-size-xs text-start">
                      Measure around the fullest part of your body, above the top of your legs.
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-center items-center width-fullsize mt-5">
                  <div className="d-flex flex-col items-center justify-center relative">
                    <div
                      className={`customToOrder-order-step-container ${
                        step !== 0 && "done"
                      } ${step === 0 && "active"}`}
                    >
                      <p className="text-font-regular font-size-sm">1</p>
                    </div>
                    <p
                      className={`customToOrder-order-step-title ${
                        step !== 0 && "done"
                      } text-font-semibold font-size-sm mt-2`}
                    >
                      Information
                    </p>
                  </div>

                  <div className="customToOrder-order-divider" />
                  <div className="d-flex flex-col items-center justify-start relative">
                    <div
                      className={`customToOrder-order-step-container ${
                        step !== 1 && step !== 0 && "done"
                      } ${step === 1 && "active"}`}
                    >
                      <p className="text-font-regular font-size-sm">2</p>
                    </div>
                    <p
                      className={`customToOrder-order-step-title ${
                        step !== 1 && step !== 0 && "done"
                      } text-font-semibold font-size-sm mt-2`}
                    >
                      Measurements
                    </p>
                  </div>
                  <div className="customToOrder-order-divider" />
                  <div className="d-flex flex-col items-center justify-start relative">
                    <div
                      className={`customToOrder-order-step-container ${
                        step === 2 && "active"
                      }`}
                    >
                      <p className="text-font-regular font-size-sm">3</p>
                    </div>
                    <p className="customToOrder-order-step-title text-font-semibold font-size-sm mt-2">
                      Terms & Conditions
                    </p>
                  </div>
                </div>
                {step === 0 && (
                  <div className="customToOrder-order-form d-flex flex-col width-fullsize gap-3">
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="firstname"
                          type="text"
                          label="First Name"
                          value={customOrder.firstName}
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
                          id="lastname"
                          type="text"
                          label="Last Name"
                          value={customOrder.lastName}
                          onChange={(e) =>
                            handleChange("lastName", e.target.value)
                          }
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
                        id="email"
                        type="email"
                        label="Email"
                        value={customOrder.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                      {errors.email && (
                        <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="d-flex flex-col width-fullsize">
                      <div className="d-flex flex-row width-fullsize gap-3">
                        <div className="d-flex flex-col width-fullsize">
                          <Select
                            label="PHONE CODE"
                            value={customOrder.phoneCode}
                            options={countryCallingCodes.map((c) => [
                              `+${c.countryCodes[0]}`,
                              `${c.isoCode2} (+${c.countryCodes[0]})`,
                            ])}
                            onChange={(e) =>
                              handleChange("phoneCode", e.target.value)
                            }
                          />
                        </div>
                        <div className="d-flex flex-col width-fullsize">
                          <Input
                            id="phone"
                            type="phone"
                            label="Phone Number"
                            value={customOrder.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>
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
                        value={customOrder.socialMedia}
                        onChange={(e) =>
                          handleChange("socialMedia", e.target.value)
                        }
                      />
                    </div>

                    <div className="d-flex flex-col width-fullsize">
                      <Select
                        label={"PREFERRED CONTACT TIME"}
                        value={customOrder.contactTime}
                        options={selectTime}
                        onChange={(e) =>
                          handleChange("contactTime", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div className="customToOrder-order-form d-flex flex-col width-fullsize gap-3">
                    <div className="d-flex flex-col width-fullsize">
                      <Select
                        label="Measurement Unit"
                        options={measureUnitOptions}
                        value={customOrder.measurementUnit}
                        onChange={(e) =>
                          handleChange("measurementUnit", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="height"
                          type="number"
                          label="Height"
                          value={customOrder.customSizeOrder.height.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "height",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="weight"
                          type="number"
                          label="Weight"
                          value={customOrder.customSizeOrder.weight.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "weight",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="bust"
                          type="number"
                          label="Bust"
                          value={customOrder.customSizeOrder.bust.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "bust",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="waist"
                          type="number"
                          label="Waist"
                          value={customOrder.customSizeOrder.waist.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "waist",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="hips"
                          type="number"
                          label="Hips"
                          value={customOrder.customSizeOrder.hips.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "hips",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="shoulderWidth"
                          type="number"
                          label="Shoulder Width"
                          value={customOrder.customSizeOrder.shoulderWidth.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "shoulderWidth",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="armLength"
                          type="number"
                          label="Arm Length"
                          value={customOrder.customSizeOrder.armLength.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "armLength",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="neckCircumference"
                          type="number"
                          label="Neck Circumference"
                          value={customOrder.customSizeOrder.neckCircumference.toString()}
                          onChange={(e) =>
                            handleCustomSizeChange(
                              "neckCircumference",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-col width-fullsize">
                      <TextArea
                        id="note"
                        label="Message"
                        value={customOrder.message}
                        onChange={(e) =>
                          handleChange("message", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="customToOrder-order-form d-flex flex-col width-fullsize gap-3">
                    <CheckBox
                      titleBtn="I agree to the Terms & Conditions"
                      classNameContainer="items-center"
                      isCheck={isCheckAgree}
                      setIsCheck={() => setIsCheckAgree(!isCheckAgree)}
                    />
                    <p className="text-font-light font-size-xs text-start">
                      1. You can request an exchange or a return of your items within 20 days from delivery following our quick and easy return procedure.
                    </p>
                    <p className="text-font-light font-size-xs text-start">
                      2. You can find more information in the section returns and refunds.
                    </p>
                    <p className="text-font-regular font-size-sm text-start mt-2">
                      After submitting, we will contact you to confirm your
                      order.
                    </p>
                    {checkboxError && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2">
                        {checkboxError}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-3">
                  {notify && (
                    <div
                      className={`customToOrder-notify ${
                        notify.status === "success" ? "success" : "fail"
                      } d-flex flex-row text-start justify-start`}
                    >
                      <p className="text-font-regular font-size-sm">
                        {notify.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="d-flex flex-row gap-3">
                  {step !== 0 && (
                    <button
                      className="customToOrder-order-button-back text-font-regular font-size-sm mt-4 mb-4"
                      onClick={handleBack}
                    >
                      BACK
                    </button>
                  )}

                  <button
                    className={`${
                      step === 2
                        ? "customToOrder-order-button-add"
                        : "customToOrder-order-button-next"
                    } text-font-regular font-size-sm mt-4 mb-4`}
                    onClick={step === 2 ? handleSubmit : handleNext}
                  >
                    {step === 2 ? "SUBMIT" : "NEXT"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
