import { ICONS } from "@constants/icons";
import { IMAGES } from "@constants/image";
import "@styles/components/customToOrder.scss";
import { useEffect, useState } from "react";
import { Input } from "./Input";
import type { OrderForm } from "@interfaces/pages/order";
import type { CustomToOrderProps } from "@interfaces/components/customToOrder";
import { Select } from "./Select";
import { TextArea } from "./TextArea";
import { CheckBox } from "./CheckBox";
import cartApi from "@api/services/cartApi";
import authApi from "@api/services/authApi";
import type { NotifyItem } from "@interfaces/pages/account";
import countryCallingCodes from "country-calling-code";
export const CustomToOrder: React.FC<CustomToOrderProps> = (props) => {
  const {
    productId,
    productName,
    productColor,
    productPrice,
    productCategories,
    isOpen,
    onClose,
  } = props;
  const measureUnitOptions: [string, string][] = [
    ["cm", "CM"],
    ["in", "IN"],
  ];

  const [step, setStep] = useState<number>(0);
  const [isCheckAgree, setIsCheckAgree] = useState<boolean>(false);
  const [checkboxError, setCheckboxError] = useState<string>("");
  const [notify, setNotify] = useState<NotifyItem | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OrderForm, string>>
  >({});
  const [order, setOrder] = useState<OrderForm>({
    firstname: "",
    lastname: "",
    email: "",
    phoneCode: "",
    phone: "",
    preferDate: "",
    measurementUnit: "cm",
    height: 0,
    weight: 0,
    bust: 0,
    waist: 0,
    hips: 0,
    shoulderWidth: 0,
    armLength: 0,
    neckCircumference: 0,
    orderNote: "",
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {};

    if (step === 0) {
      if (!order.firstname)
        newErrors.firstname = "Please enter your first name.";
      if (!order.lastname) newErrors.lastname = "Please enter your last name.";
      if (!order.email) newErrors.email = "Please enter your email.";
      if (!order.phone && !order.phoneCode)
        newErrors.phone = "Please enter your phone.";
      if (!order.preferDate)
        newErrors.preferDate = "Prefered Delivery Date is required";
    }

    if (step === 1) {
      if (!order.height) newErrors.height = "Height is required";
      if (!order.weight) newErrors.weight = "Weight is required";
      if (!order.bust) newErrors.bust = "Bust is required";
      if (!order.waist) newErrors.waist = "Waist is required";
      if (!order.hips) newErrors.hips = "Hips is required";
      if (!order.shoulderWidth)
        newErrors.shoulderWidth = "Shoulder Width is required";
      if (!order.armLength) newErrors.armLength = "Arm Length is required";
      if (!order.neckCircumference)
        newErrors.neckCircumference = "Neck Circumference is required";
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

  const handleChange = <K extends keyof OrderForm>(
    field: K,
    value: OrderForm[K]
  ) => {
    setOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validate() || !isCheckAgree) return;

    try {
      await cartApi.add({
        productId: productId,
        quantity: 1,
        size: "custom",
        color: productColor,
        customSize: {
          firstName: order.firstname,
          lastName: order.lastname,
          email: order.email,
          phone: order.phone,
          phoneCode: order.phoneCode,
          preferredDeliveryDate: order.preferDate,
          measurements: {
            height: order.height,
            weight: order.weight,
            bust: order.bust,
            waist: order.waist,
            hips: order.hips,
            shoulderWidth: order.shoulderWidth,
            armLength: order.armLength,
            neckCircumference: order.neckCircumference,
          },
        },
      });
      setNotify({
        status: "success",
        message: "Custom order added to cart. Please check your cart",
      });
    } catch (error) {
      console.error(error);
      setNotify({
        status: "fail",
        message: "Failed to add custom order to your cart.",
      });
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await authApi.getProfile();

      setOrder((prev) => ({
        ...prev,
        firstname: userData.firstname ?? "",
        lastname: userData.lastname ?? "",
        email: userData.email,
      }));
    } catch (err) {
      console.error("Lỗi khi lấy user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
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
                  {!productColor && (
                    <p className="text-font-regular font-size-sm text-start text-red-500 mt-2">
                      Please select a color before entering custom size.
                    </p>
                  )}
                </div>
                <div className="d-flex flex-col mt-4">
                  <p className="text-font-regular font-size-sm text-start text-uppercase">
                    MADE-TO-MEASURE
                  </p>
                  <p className="text-font-light-italic font-size-xs text-start mt-2">
                    Please proceed payment by selecting your custom size. If you
                    haven’t provided your measurements yet, kindly input your
                    custom size to complete the process.
                  </p>
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
                          value={order.firstname}
                          onChange={(e) =>
                            handleChange("firstname", e.target.value)
                          }
                          required
                        />
                        {errors.firstname && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.firstname}
                          </p>
                        )}
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="lastname"
                          type="text"
                          label="Last Name"
                          value={order.lastname}
                          onChange={(e) =>
                            handleChange("lastname", e.target.value)
                          }
                          required
                        />
                        {errors.lastname && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.lastname}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-col width-fullsize">
                      <Input
                        id="email"
                        type="email"
                        label="Email"
                        value={order.email}
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
                            value={order.phoneCode}
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
                            value={order.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="d-flex flex-col width-fullsize">
                      <Input
                        id="preferDate"
                        type="date"
                        label="Prefered Delivery Date"
                        value={order.preferDate}
                        onChange={(e) =>
                          handleChange("preferDate", e.target.value)
                        }
                        required
                      />
                      {errors.preferDate && (
                        <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                          {errors.preferDate}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div className="customToOrder-order-form d-flex flex-col width-fullsize gap-3">
                    <div className="d-flex flex-col width-fullsize">
                      <Select
                        label="Measurement Unit"
                        options={measureUnitOptions}
                        value={order.measurementUnit}
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
                          value={order.height.toString()}
                          onChange={(e) =>
                            handleChange("height", Number(e.target.value))
                          }
                          required
                        />
                        {errors.height && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.height}
                          </p>
                        )}
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="weight"
                          type="number"
                          label="Weight"
                          value={order.weight.toString()}
                          onChange={(e) =>
                            handleChange("weight", Number(e.target.value))
                          }
                          required
                        />
                        {errors.weight && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.weight}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="bust"
                          type="number"
                          label="Bust"
                          value={order.bust.toString()}
                          onChange={(e) =>
                            handleChange("bust", Number(e.target.value))
                          }
                          required
                        />
                        {errors.bust && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.bust}
                          </p>
                        )}
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="waist"
                          type="number"
                          label="Waist"
                          value={order.waist.toString()}
                          onChange={(e) =>
                            handleChange("waist", Number(e.target.value))
                          }
                          required
                        />
                        {errors.waist && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.waist}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="hips"
                          type="number"
                          label="Hips"
                          value={order.hips.toString()}
                          onChange={(e) =>
                            handleChange("hips", Number(e.target.value))
                          }
                          required
                        />
                        {errors.hips && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.hips}
                          </p>
                        )}
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="shoulderWidth"
                          type="number"
                          label="Shoulder Width"
                          value={order.shoulderWidth.toString()}
                          onChange={(e) =>
                            handleChange(
                              "shoulderWidth",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                        {errors.shoulderWidth && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.shoulderWidth}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-row width-fullsize gap-3">
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="armLength"
                          type="number"
                          label="Arm Length"
                          value={order.armLength.toString()}
                          onChange={(e) =>
                            handleChange("armLength", Number(e.target.value))
                          }
                          required
                        />
                        {errors.armLength && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.armLength}
                          </p>
                        )}
                      </div>
                      <div className="d-flex flex-col width-fullsize">
                        <Input
                          id="neckCircumference"
                          type="number"
                          label="Neck Circumference"
                          value={order.neckCircumference.toString()}
                          onChange={(e) =>
                            handleChange(
                              "neckCircumference",
                              Number(e.target.value)
                            )
                          }
                          required
                        />
                        {errors.neckCircumference && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errors.neckCircumference}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-col width-fullsize">
                      <TextArea
                        id="note"
                        label="Order Note"
                        value={order.orderNote}
                        onChange={(e) =>
                          handleChange("orderNote", e.target.value)
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
                      1. Minor discrepancies (+/- 1-2cm) in measurements may
                      occur due to the nature of tailoring and fabric
                      characteristics.
                    </p>
                    <p className="text-font-light font-size-xs text-start">
                      2. Custom-to-order products are non-refundable and
                      non-exchangeable, except in cases of significant technical
                      errors on our part.
                    </p>
                    <p className="text-font-light font-size-xs text-start">
                      3. All measurements provided are the customer’s
                      responsibility. Issues arising from incorrect measurements
                      will not be eligible for refund or exchange.
                    </p>
                  </div>
                )}
                {checkboxError && (
                  <p className="text-font-regular font-size-sm text-start text-red-500 mt-2">
                    {checkboxError}
                  </p>
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
                    {step === 2 ? "ADD TO CART" : "NEXT"}
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
