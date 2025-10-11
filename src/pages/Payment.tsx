import { CheckBox } from "@components/common/CheckBox";
import Footer from "@components/common/Footer";
import { RadioButton } from "@components/common/RadioButton";
import { Select } from "@components/common/Select";
import { Tabs } from "@components/common/Tab";
import { ICONS } from "@constants/icons";
import { IMAGES } from "@constants/image";
import type { CardInfor, PaymentFormData } from "@interfaces/pages/payment";
import "@styles/pages/payment.scss";
import React, { useEffect, useRef, useState } from "react";
import countryCallingCodes from "country-calling-code";
import { Input } from "@components/common/Input";
import Header from "@components/common/Header";
import authApi from "@api/services/authApi";
import addressApi from "@api/services/addressApi";
import type { AddressFormData } from "@interfaces/pages/addresses";
import { City, Country, State } from "country-state-city";
import { Button } from "@components/common/Button";
import paymentApi from "@api/services/paymentApi";
import cartApi from "@api/services/cartApi";
import type { CartItem } from "@interfaces/pages/cart";
import braintree from "braintree-web";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const hostedFieldsInstance = useRef<any>(null);
  const [clientToken, setClientToken] = useState<string>("");

  const [shipping, setShipping] = useState<string>("express");
  const [isSameAddress, setIsSameAddress] = useState<boolean>(true);
  const [isAddAdditionContact, setIsAddAdditionContact] =
    useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddAddress, setIsAddAddress] = useState<boolean>(false);
  const [isDoneAddress, setIsDoneAddress] = useState<boolean>(false);
  const [isDonePayment, setIsDonePayment] = useState<boolean>(false);
  const [errorsPayment, setErrorPayment] = useState<string>("");
  const [errorsInput, setErrorsInput] = useState<
    Partial<Record<keyof AddressFormData, string>>
  >({});
  const [isErrorAddress, setIsErrorAddress] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<AddressFormData[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressFormData | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const [cardInfo, setCardInfo] = useState<CardInfor>();
  const [checkEdit, setCheckEdit] = useState<{
    address: boolean;
    payment: boolean;
  }>({
    address: false,
    payment: false,
  });

  const [formPaymentData, setFormPaymentData] = useState<PaymentFormData>({
    nameOnCard: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "",
    state: "",
    phonecode: "",
    phone: "",
    phonecode2: "",
    phone2: "",
  });

  const [addAddress, setAddAddress] = useState<Partial<AddressFormData>>({});

  const countries = Country.getAllCountries();
  const stateList = addAddress?.country
    ? State.getStatesOfCountry(addAddress.country)
    : [];

  const cityList =
    addAddress?.country && addAddress?.state
      ? City.getCitiesOfState(addAddress.country, addAddress.state)
      : [];

  const stateListPayment =
    formPaymentData?.country && formPaymentData.country !== ""
      ? State.getStatesOfCountry(formPaymentData.country)
      : [];

  const cityListPayment =
    formPaymentData?.country && formPaymentData?.state
      ? City.getCitiesOfState(formPaymentData.country, formPaymentData.state)
      : [];

  const fetchAddress = async () => {
    try {
      const response = await addressApi.getAll();
      const items: AddressFormData[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setAddresses(items);
    } catch (error) {
      console.error("Failed to fetch Address:", error);
      return [];
    }
  };

  const fetchCart = async () => {
    try {
      const res = await cartApi.getAll();
      if (res.data) {
        setCartItems(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price),
    0
  );
  const tax = 0;
  const grandTotal = subtotal + tax;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};

    if (!addAddress?.firstName?.trim()) {
      newErrors.firstName = "Please enter your first name.";
    }
    if (!addAddress?.lastName?.trim()) {
      newErrors.lastName = "Please enter your last name";
    }
    if (!addAddress?.country?.trim()) {
      newErrors.country = "Please select country.";
    }
    if (!addAddress?.phoneCode?.trim()) {
      newErrors.phoneCode = "Please select phone code.";
    }
    if (!addAddress?.zipCode?.trim()) {
      newErrors.zipCode = "Please enter postal code.";
    } else if (!/^\d{4,10}$/.test(addAddress?.zipCode)) {
      newErrors.zipCode = "Please enter a valid postal code.";
    }
    if (!addAddress?.street?.trim()) {
      newErrors.street = "Please enter street.";
    }
    if (!addAddress?.phone?.trim()) {
      newErrors.phone = "Please enter phone number.";
    } else if (!/^[0-9+\-()\s]{6,20}$/.test(addAddress?.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    setErrorsInput(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidateCard = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!hostedFieldsInstance.current) {
        resolve(false);
        return;
      }

      hostedFieldsInstance.current.tokenize((err: any, payload: any) => {
        if (err) {
          console.error(err.code, err.message);
          if (err.code === "HOSTED_FIELDS_FIELDS_EMPTY") {
            setErrorPayment("Please fill in all card details.");
          } else if (err.code === "HOSTED_FIELDS_FIELDS_INVALID") {
            setErrorPayment("Some card details are invalid.");
          } else if (err.code === "HOSTED_FIELDS_FIELDS_INCOMPLETE") {
            setErrorPayment("Card details are incomplete.");
          }
          resolve(false);
          return;
        }
        const { cardType, lastFour, expirationMonth, expirationYear } =
          payload.details;
        setCardInfo({
          cardType,
          cardNumber: lastFour,
          cardExp: `${expirationMonth}/${expirationYear}`,
          cardName: formPaymentData.nameOnCard,
        });
        setErrorPayment("");
        resolve(true);
      });
    });
  };

  const handlePaymentCredit = async () => {
    if (!hostedFieldsInstance.current) return;
    setLoading(true);

    try {
      hostedFieldsInstance.current.tokenize(async (err: any, payload: any) => {
        if (err) {
          console.error(err.code, err.message);
          setErrorPayment("Unexpected tokenize error, please retry.");
          setLoading(false);
          return;
        }
        const shipping = selectedAddress || addAddress;
        const amount = Number(grandTotal.toFixed(2));
        const nameOnCard = formPaymentData.nameOnCard;
        const taxRate = 0;
        const shippingfee = amount < 2276.02 ? 56.9 : 0;
        try {
          const res = await paymentApi.createTransaction(
            amount,
            taxRate,
            shippingfee,
            payload.nonce,
            nameOnCard,
            {
              shippingAddress: {
                firstName: shipping.firstName || "",
                lastName: shipping.lastName || "",
                street: shipping.street || "",
                city: shipping.city || "",
                state: shipping.state || "",
                country: shipping.country || "",
                zipcode: shipping.zipCode || "",
                phoneCode: shipping.phoneCode || undefined,
                phone: shipping.phone || undefined,
              },
              billingAddress: {
                firstName: !isSameAddress
                  ? formPaymentData.firstName
                  : selectedAddress?.firstName || addAddress?.firstName || "",
                lastName: !isSameAddress
                  ? formPaymentData.lastName
                  : selectedAddress?.lastName || addAddress?.lastName || "",
                street: !isSameAddress
                  ? formPaymentData.address1
                  : selectedAddress?.street || addAddress?.street || "",
                street2: !isSameAddress ? formPaymentData.address2 : undefined,
                city: !isSameAddress
                  ? formPaymentData.city
                  : selectedAddress?.city || addAddress?.city || "",
                state: !isSameAddress
                  ? formPaymentData.state
                  : selectedAddress?.state || addAddress?.state || "",
                country: !isSameAddress
                  ? formPaymentData.country
                  : selectedAddress?.country || addAddress?.country || "",
                zipcode: !isSameAddress
                  ? formPaymentData.postcode
                  : selectedAddress?.zipCode || addAddress?.zipCode || "",
                phoneCode: !isSameAddress
                  ? formPaymentData.phonecode
                  : selectedAddress?.phoneCode || addAddress?.phoneCode || "",
                phone: !isSameAddress
                  ? formPaymentData.phone
                  : selectedAddress?.phone || addAddress?.phone || "",
                phoneCode2: !isSameAddress
                  ? formPaymentData.phonecode2
                  : undefined,
                phone2: !isSameAddress ? formPaymentData.phone2 : undefined,
              },
            }
          );
          if (hostedFieldsInstance.current) {
            hostedFieldsInstance.current.teardown((err: any) => {
              if (err) console.error("Error tearing down Hosted Fields:", err);
            });
            hostedFieldsInstance.current = null;
          }

          if (res.data.success) {
            navigate("/checkout/notify", {
              state: { status: "success" },
            });
          } else {
            navigate("/checkout/notify", {
              state: { status: "fail" },
            });
          }
        } catch (err: any) {
          if (hostedFieldsInstance.current) {
            hostedFieldsInstance.current.teardown((err: any) => {
              if (err) console.error("Error tearing down Hosted Fields:", err);
            });
            hostedFieldsInstance.current = null;
          }
          navigate("/checkout/notify", {
            state: { status: "fail" },
          });
          alert(err);
        } finally {
          setLoading(false);
        }
      });
    } catch (err: any) {
      if (hostedFieldsInstance.current) {
        hostedFieldsInstance.current.teardown((err: any) => {
          if (err) console.error("Error tearing down Hosted Fields:", err);
        });
        hostedFieldsInstance.current = null;
      }
      setLoading(false);
    }
  };

  const handleCreatePaypalOrder = async () => {
    const amount = Number(grandTotal.toFixed(2));
    const shippingfee = amount < 2276.02 ? 56.9 : 0;
    const res = await paymentApi.createPaypalOrder(amount + shippingfee, "USD");
    return res.data.order.id;
  };

  const handleApprovePaypalOrder = async (data: any) => {
    const shipping = selectedAddress || addAddress;
    const shippingData = {
      ...shipping,
      zipcode: shipping.zipCode,
    };
    const taxRate = 0;
    const amount = Number(grandTotal.toFixed(2));
    const shippingfee = amount < 2276.02 ? 56.9 : 0;
    const res = await paymentApi.capturePaypalOrder(
      data.orderID,
      taxRate,
      shippingfee,
      shippingData
    );
    if (res.data.success) {
      navigate("/checkout/notify", {
        state: { status: "success" },
      });
    } else {
      navigate("/checkout/notify", {
        state: { status: "fail" },
      });
    }
  };

  const handlePayment = async () => {
    if (currentTab === 0) {
      const isValid = await handleValidateCard();
      if (isValid) setIsDonePayment(true);
    } else if (currentTab === 1) {
      setIsDonePayment(true);
    }
  };

  const fetchUserEmail = async () => {
    try {
      const res = await authApi.getProfile();
      if (res.email) {
        setEmail(res.email);
      }
    } catch (error) {
      console.error("Get user fail:", error);
    }
  };

  const handleChangePayment = <K extends keyof PaymentFormData>(
    field: K,
    value: PaymentFormData[K]
  ) => {
    setFormPaymentData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "country" ? { state: "", city: "" } : {}),
    }));
  };
  const handleChangeAdd = <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K]
  ) => {
    setAddAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchClientToken = async () => {
    try {
      const res = await paymentApi.getClientToken();
      setClientToken(res.data.clientToken);
    } catch (err) {
      console.error("Failed to get client token:", err);
    }
  };

  const initHostedFields = () => {
    if (!clientToken) return;

    if (hostedFieldsInstance.current) {
      hostedFieldsInstance.current.teardown((err: any) => {
        if (err) console.error("Error tearing down Hosted Fields:", err);
      });
      hostedFieldsInstance.current = null;
    }

    braintree.client.create(
      { authorization: clientToken },
      (err, clientInstance) => {
        if (err) return console.error(err);
        braintree.hostedFields.create(
          {
            client: clientInstance,
            styles: { input: { "font-size": "16px" } },
            fields: {
              number: {
                selector: "#card-number",
                placeholder: "4111 1111 1111 1111",
              },
              cvv: { selector: "#cvv", placeholder: "123" },
              expirationDate: {
                selector: "#expiration-date",
                placeholder: "MM/YYYY",
              },
            },
          },
          (err, hfInstance) => {
            if (err) return console.error(err);
            hostedFieldsInstance.current = hfInstance;
          }
        );
      }
    );
  };

  const checkIsEdit = (field: "address" | "payment") => {
    setCheckEdit((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    fetchClientToken();
    fetchUserEmail();
    fetchAddress();
    fetchCart();
    setLoading(false);
  }, []);

  return (
    <>
      <Header backgroundColor="black" />
      <div className="payment gap-5">
        <div className="d-flex flex-col width-fullsize">
          <div className="payment-account d-flex flex-col items-start">
            <p className="text-font-regular font-size-sm text-uppercase">
              You are checking out as:
            </p>
            <p className="text-font-regular font-size-sm">{email}</p>
          </div>
          <div className="d-flex flex-col">
            <div className="d-flex flex-row items-center mt-4">
              <div className="d-flex flex-row items-center width-fullsize">
                <div
                  className={`payment-step ${
                    isDoneAddress && "done"
                  } d-flex justify-center items-center`}
                >
                  {isDoneAddress ? (
                    <img
                      src={ICONS.done}
                      alt=""
                      className="payment-step-icon"
                    />
                  ) : (
                    <p className="text-font-semibold font-size-sm">1</p>
                  )}
                </div>
                <p className="payment-step-label text-font-semibold text-uppercase text-start ml-3">
                  Shipping Address
                </p>
              </div>
              {isDoneAddress && (
                <div
                  className="payment-step-button-edit d-flex flex-row justify-end mr-3"
                  onClick={() => {
                    setIsDoneAddress(false);
                    checkIsEdit("address");
                    if (!isDonePayment && cardInfo) setIsDonePayment(true);
                  }}
                >
                  <Button
                    label="EDIT"
                    variant="static-underline"
                    className="text-font-semibold"
                  />
                </div>
              )}
            </div>
            {selectedAddress && isDoneAddress && (
              <div className="payment-address-done">
                <div className="d-flex flex-col items-start gap-2">
                  <p className="text-font-semibold font-size-sm text-start text-uppercase">
                    {removeVietnameseTones(selectedAddress?.lastName)}
                    {removeVietnameseTones(selectedAddress?.firstName)}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {removeVietnameseTones(selectedAddress?.street)}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {removeVietnameseTones(selectedAddress?.city)}
                    {selectedAddress?.city && ", "}
                    {removeVietnameseTones(
                      State.getStatesOfCountry(selectedAddress?.country).find(
                        (s) => s.isoCode === selectedAddress?.state
                      )?.name ?? ""
                    )}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {removeVietnameseTones(
                      Country.getCountryByCode(selectedAddress?.country)
                        ?.name ?? ""
                    )}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {selectedAddress?.zipCode}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {selectedAddress?.phoneCode} {selectedAddress?.phone}
                  </p>
                </div>
                <div className="d-flex flex-col items-start gap-2">
                  <p className="text-font-semibold font-size-sm text-start text-uppercase">
                    Express
                  </p>
                  <p className="text-font-regular font-size-sm text-start">
                    US${" "}
                    {Number(grandTotal.toFixed(2)) < 2276.02 ? "56.90" : "0"}
                  </p>
                  <p className="text-font-regular font-size-sm text-start">
                    You will be notified when your item is shipped.
                  </p>
                </div>
              </div>
            )}

            {Object.keys(addAddress).length !== 0 && isDoneAddress && (
              <div className="payment-address-done">
                <div className="d-flex flex-col items-start gap-2">
                  <p className="text-font-semibold font-size-sm text-start text-uppercase">
                    {removeVietnameseTones(addAddress?.lastName ?? "")}{" "}
                    {removeVietnameseTones(addAddress?.firstName ?? "")}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {removeVietnameseTones(addAddress?.street ?? "")}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {removeVietnameseTones(addAddress?.city ?? "")}
                    {addAddress?.city && ", "}
                    {removeVietnameseTones(
                      State.getStatesOfCountry(addAddress?.country).find(
                        (s) => s.isoCode === addAddress?.state
                      )?.name ?? ""
                    )}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {removeVietnameseTones(
                      Country.getCountryByCode(addAddress?.country || "")
                        ?.name ?? ""
                    )}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {addAddress?.zipCode}
                  </p>
                  <p className="text-font-regular font-size-sm text-start ">
                    {addAddress?.phoneCode} {addAddress?.phone}
                  </p>
                </div>
                <div className="d-flex flex-col items-start gap-2">
                  <p className="text-font-semibold font-size-sm text-start text-uppercase">
                    Express
                  </p>
                  <p className="text-font-regular font-size-sm text-start">
                    US$ 0
                  </p>
                  <p className="text-font-regular font-size-sm text-start">
                    You will be notified when your item is shipped.
                  </p>
                </div>
              </div>
            )}

            {!isDoneAddress && (
              <div className="d-flex flex-col width-fullsize">
                <div className="payment-address-wrap width-fullsize gap-1">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`payment-address d-flex flex-col mt-4 ${
                        selectedAddressId === addr.id ? "choose" : ""
                      }`}
                      onClick={() => {
                        setSelectedAddressId(addr.id ?? "");
                        setSelectedAddress(addr);
                        setIsAddAddress(false);
                        setAddAddress({});
                      }}
                    >
                      {addr.isDefault && (
                        <div className="payment-address-status">
                          <p className="text-font-semibold font-size-xs text-start">
                            PRIMARY SHIPPING
                          </p>
                        </div>
                      )}
                      <div className="d-flex flex-col items-start mt-2 ml-2">
                        <p className="text-font-light font-size-sm text-uppercase">
                          {removeVietnameseTones(addr?.firstName)}{" "}
                          {removeVietnameseTones(addr?.lastName)}
                        </p>
                        <p className="text-font-light font-size-sm text-start">
                          {removeVietnameseTones(addr?.street)}
                        </p>
                        <p className="text-font-light font-size-sm text-start">
                          {removeVietnameseTones(addr?.city)}
                          {addr?.city && ", "}
                          {removeVietnameseTones(
                            State.getStatesOfCountry(addr?.country).find(
                              (s) => s.isoCode === addr?.state
                            )?.name ?? ""
                          )}
                        </p>
                        <p className="text-font-light font-size-sm text-start">
                          {removeVietnameseTones(
                            Country.getCountryByCode(addr?.country)?.name ?? ""
                          )}
                        </p>
                        <p className="text-font-light font-size-sm text-start">
                          {addr?.zipCode}
                        </p>
                        <p className="text-font-light font-size-sm text-start">
                          T:
                          <span className="ml-2">
                            {addr?.phoneCode} {addr?.phone}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-row justify-start items-center gap-1 mt-3">
                  <img src={ICONS.add} alt="" className="payment-address-add" />
                  <Button
                    label="New Address"
                    variant="static-underline"
                    onClick={() => {
                      setIsAddAddress(true);
                      setSelectedAddressId(null);
                      setSelectedAddress(null);
                      setErrorsInput({});
                    }}
                    className="font-size-sm text-font-regular"
                  />
                </div>

                {addresses.length === 0 ||
                  (isAddAddress && (
                    <div className="d-flex flex-col mt-3">
                      <div className="d-flex flex-row width-fullsize gap-3 mt-3">
                        <div className="width-fullsize">
                          <Input
                            id={"firstname"}
                            label={"First Name"}
                            type="text"
                            value={addAddress?.firstName}
                            required
                            onChange={(e) =>
                              handleChangeAdd("firstName", e.target.value)
                            }
                          />
                          {errorsInput.firstName && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                              {errorsInput.firstName}
                            </p>
                          )}
                        </div>
                        <div className="width-fullsize">
                          <Input
                            id={"lastname"}
                            label={"Last Name"}
                            type="text"
                            value={addAddress?.lastName}
                            required
                            onChange={(e) =>
                              handleChangeAdd("lastName", e.target.value)
                            }
                          />
                          {errorsInput.lastName && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                              {errorsInput.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <Select
                          label="COUNTRY"
                          options={countries.map((c) => [c.isoCode, c.name])}
                          value={addAddress!.country}
                          onChange={(e) =>
                            handleChangeAdd("country", e.target.value)
                          }
                          required
                        />
                        {errorsInput.country && (
                          <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                            {errorsInput.country}
                          </p>
                        )}
                      </div>
                      <div className="addresses-modal-select-wrap width-fullsize gap-3 mt-3">
                        <div className="width-fullsize">
                          <Select
                            label="State/Province/Region"
                            value={addAddress?.state}
                            options={stateList.map((s) => [s.isoCode, s.name])}
                            onChange={(e) =>
                              handleChangeAdd("state", e.target.value)
                            }
                            required
                          />
                          {errorsInput.state && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                              {errorsInput.state}
                            </p>
                          )}
                        </div>
                        <div className="width-fullsize">
                          <Select
                            label="City/District"
                            value={addAddress?.city}
                            options={cityList.map((c) => [c.name, c.name])}
                            onChange={(e) =>
                              handleChangeAdd("city", e.target.value)
                            }
                            required
                          />
                          {errorsInput.city && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                              {errorsInput.city}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="addresses-modal-select-wrap gap-3 mt-3">
                        <div className="width-fullsize">
                          <Input
                            id={"street"}
                            type={"text"}
                            label={"Street Address"}
                            value={addAddress?.street}
                            onChange={(e) =>
                              handleChangeAdd("street", e.target.value)
                            }
                            required
                          />
                          {errorsInput.street && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                              {errorsInput.street}
                            </p>
                          )}
                          {errorsInput.zipCode && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                              {errorsInput.zipCode}
                            </p>
                          )}
                        </div>

                        <div className="">
                          <Input
                            id={"postal_code"}
                            type="text"
                            label="POSTAL CODE"
                            value={addAddress?.zipCode}
                            onChange={(e) =>
                              handleChangeAdd("zipCode", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row mt-3">
                        <div className="d-flex flex-col justify-center items-start width-fullsize">
                          <div className=" d-flex flex-row width-fullsize gap-3 mt-2">
                            <div className="addresses-modal-select-phone">
                              <Select
                                label="PHONE CODE"
                                value={addAddress?.phoneCode}
                                options={countryCallingCodes.map((c) => [
                                  `+${c.countryCodes[0]}`,
                                  `${c.isoCode2} (+${c.countryCodes[0]})`,
                                ])}
                                onChange={(e) =>
                                  handleChangeAdd("phoneCode", e.target.value)
                                }
                              />
                            </div>
                            <Input
                              id={"phone"}
                              type="tel"
                              label={"Phone"}
                              value={addAddress?.phone}
                              onChange={(e) =>
                                handleChangeAdd("phone", e.target.value)
                              }
                              required
                            />
                          </div>
                          {errorsInput.phoneCode && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                              {errorsInput.phoneCode}
                            </p>
                          )}
                          {errorsInput.phone && (
                            <p className="text-font-regular font-size-sm text-start text-red-500 mt-1 ml-1">
                              {errorsInput.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                <div className="d-flex flex-col mt-4">
                  <p className="text-font-semibold font-size-md text-uppercase text-start">
                    Delivery Method
                  </p>
                  <div className="d-flex flex-row items-center mt-2">
                    <div className="payment-address-radio">
                      <RadioButton
                        label={`Express  -  ${
                          Number(grandTotal.toFixed(2)) < 2276.02
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(56.9)
                            : "Free"
                        }`}
                        value="express"
                        name="shipping"
                        checked={shipping === "express"}
                        onChange={setShipping}
                      />
                    </div>

                    <p className="text-font-light font-size-xs text-start ml-5">
                      You will be notified when your item is shipped
                    </p>
                  </div>
                </div>
                {isErrorAddress && (
                  <p className="text-font-regular font-size-sm text-start text-red-500 mt-3 ml-1">
                    Please select a shipping address before continuing.
                  </p>
                )}

                <button
                  className="payment-button text-font-semibold font-size-sm text-uppercase mt-3"
                  onClick={async () => {
                    if (clientToken) initHostedFields();
                    if (Object.keys(addAddress).length !== 0) {
                      if (!validate()) return;
                      setIsDoneAddress(true);
                      setIsErrorAddress(false);
                    } else if (selectedAddress) {
                      setIsDoneAddress(true);
                      setIsErrorAddress(false);
                    } else {
                      setIsErrorAddress(true);
                    }
                  }}
                >
                  {checkEdit.address && (cardInfo || currentTab === 1)
                    ? "Save Changes"
                    : "Continue to payment"}
                </button>
              </div>
            )}
          </div>
          <div className="d-flex flex-col mt-4">
            <div
              className={`${
                !isDoneAddress &&
                !cardInfo &&
                currentTab === 0 &&
                "payment-step-container"
              } d-flex flex-row items-center`}
            >
              <div
                className={`payment-step ${
                  isDonePayment && "done"
                } d-flex justify-center items-center`}
              >
                {isDonePayment ? (
                  <img src={ICONS.done} alt="" className="payment-step-icon" />
                ) : (
                  <p className="text-font-semibold font-size-sm">2</p>
                )}
              </div>
              <p className="payment-step-label text-font-semibold font-size-xl text-uppercase text-start ml-3">
                Payment
              </p>
              {isDonePayment && (
                <div
                  className="payment-button-edit d-flex flex-row justify-end width-fullsize mr-3"
                  onClick={() => {
                    setIsDonePayment(false);
                    checkIsEdit("payment");
                    if (!isDoneAddress) setIsDoneAddress(true);
                  }}
                >
                  <Button
                    label="EDIT"
                    variant="static-underline"
                    className="text-font-semibold"
                  />
                </div>
              )}
            </div>
            {isDonePayment && currentTab === 1 && (
              <div className="payment-infor-paypal-wrap d-flex flex-row items-center gap-1">
                <img
                  src={IMAGES.paypal}
                  alt=""
                  className="payment-infor-paypal"
                />
                <p className="text-font-regular font-size-sm text-start">
                  Paypal Account
                </p>
              </div>
            )}

            {isDonePayment && cardInfo && currentTab === 0 && (
              <div className="payment-infor gap-3">
                <div className="d-flex flex-col gap-2 items-start">
                  <div className="d-flex flex-row items-center gap-1">
                    <img
                      src={
                        cardInfo.cardType === "Visa"
                          ? IMAGES.visa
                          : cardInfo.cardType === "MasterCard"
                          ? IMAGES.masterCard
                          : cardInfo.cardType === "American Express"
                          ? IMAGES.amex
                          : cardInfo.cardType === "Diners Club"
                          ? IMAGES.diner
                          : cardInfo.cardType === "JCB"
                          ? IMAGES.jcb
                          : cardInfo.cardType === "UnionPay"
                          ? IMAGES.union
                          : cardInfo.cardType === "Discover"
                          ? IMAGES.discover
                          : ""
                      }
                      alt=""
                      className="payment-infor-card"
                    />
                    <p className="text-font-regular font-size-sm text-start">
                      {cardInfo.cardType}
                    </p>
                  </div>
                  <p className="text-font-regular font-size-sm text-start">
                    ********{cardInfo.cardNumber}
                  </p>
                  <p className="text-font-regular font-size-sm text-start">
                    {cardInfo.cardName}
                  </p>
                  <p className="text-font-regular font-size-sm text-start">
                    Expires {cardInfo.cardExp}
                  </p>
                </div>
                {isSameAddress && Object.keys(addAddress).length !== 0 && (
                  <div className="d-flex flex-col gap-2">
                    <p className="text-font-semibold font-size-sm text-start text-uppercase">
                      {removeVietnameseTones(addAddress.firstName ?? "")}{" "}
                      {removeVietnameseTones(addAddress.lastName ?? "")}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {removeVietnameseTones(addAddress.street ?? "")}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {removeVietnameseTones(addAddress.city ?? "")}
                      {addAddress.city ?? ", "}
                      {removeVietnameseTones(
                        State.getStatesOfCountry(selectedAddress?.country).find(
                          (s) => s.isoCode === addAddress?.state
                        )?.name ?? ""
                      )}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {removeVietnameseTones(
                        Country.getCountryByCode(addAddress?.country || "")
                          ?.name ?? ""
                      )}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {addAddress.zipCode}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {addAddress.phoneCode} {addAddress.phone}
                    </p>
                  </div>
                )}
                {isSameAddress && selectedAddress && (
                  <div className="d-flex flex-col gap-2">
                    <p className="text-font-semibold font-size-sm text-start text-uppercase">
                      {removeVietnameseTones(selectedAddress.firstName)}{" "}
                      {removeVietnameseTones(selectedAddress.lastName)}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {removeVietnameseTones(selectedAddress.street)}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {removeVietnameseTones(selectedAddress.city)}
                      {selectedAddress.city && ", "}
                      {removeVietnameseTones(
                        State.getStatesOfCountry(selectedAddress?.country).find(
                          (s) => s.isoCode === selectedAddress?.state
                        )?.name ?? ""
                      )}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {
                        Country.getCountryByCode(selectedAddress?.country || "")
                          ?.name
                      }
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {selectedAddress.zipCode}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {selectedAddress.phoneCode} {selectedAddress.phone}
                    </p>
                  </div>
                )}
                {!isSameAddress && (
                  <div className="d-flex flex-col gap-2">
                    <p className="text-font-semibold font-size-sm text-start text-uppercase">
                      {removeVietnameseTones(formPaymentData.firstName)}{" "}
                      {removeVietnameseTones(formPaymentData.lastName)}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {removeVietnameseTones(formPaymentData?.address1)}
                    </p>
                    {formPaymentData?.address2 && (
                      <p className="text-font-regular font-size-sm text-start">
                        {removeVietnameseTones(formPaymentData?.address2)}
                      </p>
                    )}
                    <p className="text-font-regular font-size-sm text-start">
                      {removeVietnameseTones(formPaymentData.city)}
                      {formPaymentData.city && ", "}
                      {removeVietnameseTones(
                        State.getStatesOfCountry(formPaymentData?.country).find(
                          (s) => s.isoCode === formPaymentData?.state
                        )?.name ?? ""
                      )}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {formPaymentData.postcode}
                    </p>
                    <p className="text-font-regular font-size-sm text-start">
                      {formPaymentData.phonecode} {formPaymentData.phone}
                    </p>
                    {formPaymentData.phonecode2 && formPaymentData.phone2 && (
                      <p className="text-font-regular font-size-sm text-start">
                        {formPaymentData.phonecode2} {formPaymentData.phone2}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div
              className={`payment-tab ${
                isDoneAddress && !isDonePayment ? "block" : "none"
              } d-flex flex-col items-start width-fullsize mt-4`}
            >
              <Tabs
                onTabChange={(index) => setCurrentTab(index)}
                tabs={[
                  {
                    label: "Credit Card",
                    content: (
                      <div className="d-flex flex-col">
                        <div className="payment-credit-wrap gap-2 width-fullsize">
                          <div className="d-flex flex-col width-fullsize">
                            <div className="d-flex flex-row items-center">
                              <p className="text-font-semibold font-size-sm text-uppercase">
                                Credit Card Number
                              </p>
                            </div>
                            <div
                              id="card-number"
                              className="payment-input-card"
                            ></div>
                          </div>
                          <div className="d-flex flex-col">
                            <div className="d-flex flex-row items-center">
                              <p className="text-font-semibold font-size-sm text-uppercase">
                                CVC
                              </p>
                            </div>
                            <div id="cvv" className="payment-input-card"></div>
                          </div>
                          <div className="d-flex flex-col">
                            <div className="d-flex flex-row items-center">
                              <p className="text-font-semibold font-size-sm text-uppercase">
                                Expiration Date
                              </p>
                            </div>
                            <div
                              id="expiration-date"
                              className="payment-input-card"
                            ></div>
                          </div>
                        </div>
                        <div className="d-flex flex-row items-center mt-2">
                          <p className="text-font-regular font-size-sm text-start">
                            Accepted credit cards
                          </p>
                          <div className="payment-credit-card gap-2 ml-3">
                            <img
                              src={IMAGES.jcb}
                              alt=""
                              className="payment-credit-icon"
                            />
                            <img
                              src={IMAGES.visa}
                              alt=""
                              className="payment-credit-icon"
                            />
                            <img
                              src={IMAGES.amex}
                              alt=""
                              className="payment-credit-icon"
                            />
                            <img
                              src={IMAGES.diner}
                              alt=""
                              className="payment-credit-icon"
                            />
                            <img
                              src={IMAGES.masterCard}
                              alt=""
                              className="payment-credit-icon"
                            />
                            <img
                              src={IMAGES.union}
                              alt=""
                              className="payment-credit-icon"
                            />
                            <img
                              src={IMAGES.discover}
                              alt=""
                              className="payment-credit-icon"
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-col mt-2">
                          <div className="d-flex flex-row items-center">
                            <p className="text-font-semibold font-size-sm text-uppercase">
                              Name on Card
                            </p>
                          </div>
                          <input
                            id="text"
                            type="text"
                            value={formPaymentData.nameOnCard}
                            onChange={(e) => {
                              const noAccentUpper = e.target.value
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .toUpperCase();
                              handleChangePayment("nameOnCard", noAccentUpper);
                            }}
                            required
                            className="payment-input payment-input-card-name text-font-regular font-size-sm text-uppercase mt-2"
                          />
                        </div>
                        <div className="d-flex flex-col justify-center mt-3">
                          <CheckBox
                            isCheck={isSameAddress}
                            setIsCheck={() => setIsSameAddress(!isSameAddress)}
                            titleBtn={
                              "Billing Address and Phone are the same as Shipping Information."
                            }
                            classNameContainer="payment-credit-checkbox"
                          />
                        </div>
                        {!isSameAddress && (
                          <div className="d-flex flex-col items-start mt-3">
                            <p className="text-font-semibold font-size-sm">
                              Please enter the corresponding billing information
                              for the payment method you intend to use.
                            </p>
                            <div className="d-flex flex-row width-fullsize gap-3 mt-3">
                              <Input
                                id={"firstname"}
                                type={"text"}
                                label="FIRST NAME"
                                value={formPaymentData.firstName}
                                onChange={(e) =>
                                  handleChangePayment(
                                    "firstName",
                                    e.target.value
                                  )
                                }
                                required
                              />
                              <Input
                                id={"lastname"}
                                type={"text"}
                                label="LAST NAME"
                                value={formPaymentData.lastName}
                                onChange={(e) =>
                                  handleChangePayment(
                                    "lastName",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="width-fullsize mt-3">
                              <Input
                                id={"address1"}
                                type={"text"}
                                label="ADDRESS 1"
                                value={formPaymentData.address1}
                                onChange={(e) =>
                                  handleChangePayment(
                                    "address1",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="width-fullsize mt-3">
                              <Input
                                id={"address2"}
                                type={"text"}
                                label="ADDRESS 2"
                                value={formPaymentData.address2}
                                onChange={(e) =>
                                  handleChangePayment(
                                    "address2",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="payment-credit-billing width-fullsize gap-3 mt-3">
                              <Select
                                label="COUNTRY"
                                options={countries.map((c) => [
                                  c.isoCode,
                                  c.name,
                                ])}
                                value={formPaymentData!.country}
                                onChange={(e) =>
                                  handleChangePayment("country", e.target.value)
                                }
                                required
                              />

                              <div className="width-fullsize">
                                <Select
                                  label="State/Province/Region"
                                  value={formPaymentData?.state}
                                  options={stateListPayment.map((s) => [
                                    s.isoCode,
                                    s.name,
                                  ])}
                                  onChange={(e) =>
                                    handleChangePayment("state", e.target.value)
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-row width-fullsize gap-3 mt-3">
                              <div className="width-fullsize">
                                <Select
                                  label="City/District"
                                  value={formPaymentData?.city}
                                  options={cityListPayment.map((c) => [
                                    c.name,
                                    c.name,
                                  ])}
                                  onChange={(e) =>
                                    handleChangePayment("city", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div className="">
                                <Input
                                  id={"postcode"}
                                  type={"text"}
                                  label="POSTCODE"
                                  value={formPaymentData.postcode}
                                  onChange={(e) =>
                                    handleChangePayment(
                                      "postcode",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-row width-fullsize mt-3">
                              <div className="payment-credit-billing-phonecode">
                                <Select
                                  label="PHONE CODE"
                                  value={
                                    formPaymentData?.phonecode
                                      ? formPaymentData?.phonecode
                                      : "+84"
                                  }
                                  options={countryCallingCodes.map((c) => [
                                    `+${c.countryCodes[0]}`,
                                    `${c.isoCode2} (+${c.countryCodes[0]})`,
                                  ])}
                                  onChange={(e) =>
                                    handleChangePayment(
                                      "phonecode",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div className="width-fullsize ml-3">
                                <Input
                                  id={"phone"}
                                  type={"phone"}
                                  label="PHONE NUMBER"
                                  value={formPaymentData.phone}
                                  onChange={(e) =>
                                    handleChangePayment("phone", e.target.value)
                                  }
                                  classNameLabel="text-start"
                                  required
                                />
                              </div>
                            </div>
                            <div className="mt-3">
                              <CheckBox
                                isCheck={isAddAdditionContact}
                                setIsCheck={() =>
                                  setIsAddAdditionContact(!isAddAdditionContact)
                                }
                                titleBtn={"Add additional contact number"}
                                classNameContainer="payment-credit-checkbox"
                              />
                            </div>
                            {isAddAdditionContact && (
                              <div className="d-flex flex-row width-fullsize mt-3">
                                <div className="payment-credit-billing-phonecode">
                                  <Select
                                    label="PHONE CODE"
                                    value={formPaymentData?.phonecode2}
                                    options={countryCallingCodes.map((c) => [
                                      `+${c.countryCodes[0]}`,
                                      `${c.isoCode2} (+${c.countryCodes[0]})`,
                                    ])}
                                    onChange={(e) =>
                                      handleChangePayment(
                                        "phonecode2",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="width-fullsize ml-3">
                                  <Input
                                    id={"phone"}
                                    type={"phone"}
                                    label="PHONE NUMBER"
                                    classNameLabel="text-start"
                                    value={formPaymentData.phone2}
                                    onChange={(e) =>
                                      handleChangePayment(
                                        "phone2",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    label: "PayPal",
                    content: (
                      <div className="d-flex flex-row justify-start">
                        <p className="text-font-regular font-size-sm text-start">
                          To continue your order with PayPal, please select
                          'CONFIRM DETAILS' below. Then select 'Pay with
                          PayPal'. You will then be prompted to login to your
                          PayPal account.
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
              {errorsPayment && (
                <p className="text-font-regular font-size-sm text-start text-red-500 mt-4 ml-1">
                  {errorsPayment}
                </p>
              )}
              <button
                className="payment-button text-font-semibold font-size-sm text-uppercase mt-3"
                onClick={handlePayment}
              >
                {checkEdit.payment ? "Save Changes" : "Confirm Details"}
              </button>
            </div>
          </div>
        </div>
        <div className="payment-order-container d-flex flex-col">
          <div className=" d-flex flex-col">
            <p className="text-font-semibold font-size-md text-uppercase">
              Order Summary
            </p>
            <div className="d-flex flex-row justify-center items-center">
              <img src={ICONS.cart} alt="" className="payment-order-icon" />
              <p className="text-font-semibold font-size-base ml-1">
                <span>{cartItems.length}</span> ITEMS
              </p>
            </div>
          </div>
          <div className="payment-divider mt-4" />
          <div className="d-flex flex-col">
            {cartItems.map((item) => (
              <div className="d-flex flex-col width-fullsize mt-3 p-2">
                <div className="payment-order-items d-flex flex-row width-fullsize">
                  <img
                    src={item.product.productGallery[0]}
                    alt=""
                    className="payment-order-items-image"
                  />
                  <div className="d-flex flex-col width-fullsize ml-2">
                    <p className="text-font-semibold font-size-sm text-uppercase text-start">
                      {item.product.name}
                    </p>
                    {item.category && (
                      <div className="text-font-regular font-size-sm d-flex flex-row">
                        <p className="payment-order-label text-start">
                          Category:
                        </p>
                        <p className="text-capitalize">{item.category}</p>
                      </div>
                    )}
                    <div className="text-font-regular font-size-sm d-flex flex-row">
                      <p className="payment-order-label text-start">Color:</p>
                      <p>{item.color}</p>
                    </div>
                    <div className="text-font-regular font-size-sm d-flex flex-row">
                      <p className="payment-order-label text-start">Size:</p>
                      <p>{item.size}</p>
                    </div>
                    <div className="text-font-regular font-size-sm d-flex flex-row">
                      <p className="payment-order-label text-start">
                        Quantity:
                      </p>
                      <p>1</p>
                    </div>

                    <div className="d-flex flex-row justify-end items-end fullsize">
                      <p className="text-font-semibold font-size-sm">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="payment-order-divider mt-4" />
              </div>
            ))}
            <div className="d-flex flex-col p-2">
              <div className="d-flex flex-row justify-between text-font-regular font-size-sm mt-2">
                <p>Subtotal</p>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(subtotal)}
                </p>
              </div>
              <div className="d-flex flex-row justify-between text-font-regular font-size-sm mt-2">
                <p>Shipping(Express)</p>
                <p>
                  {Number(grandTotal.toFixed(2)) < 2276.02
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(56.9)
                    : "Free"}
                </p>
              </div>
              <div className="d-flex flex-row justify-between text-font-semibold font-size-sm text-uppercase mt-2">
                <p>Total</p>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    Number(subtotal.toFixed(2)) +
                      (subtotal < 2276.02 ? 56.9 : 0)
                  )}
                </p>
              </div>
            </div>
            <div className="d-flex flex-col width-fullsize gap-2 mt-3">
              {isDoneAddress && isDonePayment && currentTab === 0 ? (
                <button
                  className="payment-order-button text-font-semibold font-size-sm text-uppercase"
                  onClick={handlePaymentCredit}
                >
                  {loading ? "Loading..." : "Place Order"}
                </button>
              ) : (
                currentTab === 1 &&
                (selectedAddress || addAddress) &&
                isDonePayment &&
                isDoneAddress && (
                  <PayPalButtons
                    className="payment-order-button-paypal"
                    fundingSource="paypal"
                    createOrder={handleCreatePaypalOrder}
                    onApprove={handleApprovePaypalOrder}
                  />
                )
              )}
              <p className="text-font-regular font-size-xs text-justify">
                Please note that the full payment will be charged immediately
                when the order is placed. This payment ensures that your order
                is reserved and allows us to proceed with production or prepare
                the goods in a timely manner. Please carefully check your
                payment information and make sure your card or chosen payment
                method has sufficient funds to avoid any interruptions during
                order processing.
              </p>
              <p className="text-font-semibold font-size-sm text-justify">
                For urgent matters, please contact us at:
                <a href="tel:+84906505070"> +84 906 505 070</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};
