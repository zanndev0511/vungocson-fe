import React, { useEffect, useRef, useState } from "react";
import { CheckBox } from "@components/common/CheckBox";
import { Input } from "@components/common/Input";
import { Select } from "@components/common/Select";
import { Overview } from "./Overview";
import Modal from "@components/common/Modal";
import { Button } from "@components/common/Button";
import { ICONS } from "@constants/icons";
import type { AddressFormData, Notify } from "@interfaces/pages/addresses";
import "@styles/pages/addresses.scss";
import countryCallingCodes from "country-calling-code";
import addressApi from "@api/services/addressApi";
import { useCountriesStatesCities } from "@hooks/useCountriesStatesCities";

export const Addresses: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [address, setAddress] = useState<AddressFormData>({
    title: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    zipCode: "",
    state: "",
    country: "",
    phoneCode: "",
    phone: "",
    isDefault: false,
  });

  const [addressEdit, setAddressEdit] = useState<AddressFormData>({
    title: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    zipCode: "",
    state: "",
    country: "",
    phoneCode: "+84",
    phone: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorsInput, setErrorsInput] = useState<
    Partial<Record<keyof AddressFormData, string>>
  >({});
  const [isCheckDefault, setIsCheckDefault] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [notify, setNotify] = useState<Notify>({
    add: { status: "", message: "" },
    edit: { status: "", message: "" },
  });
  type ModalType = "edit" | "delete" | "add" | "setDefault";
  const [typeModal, setTypeModal] = useState<ModalType>("edit");
  const [fetchedAddress, setFetchedAddress] = useState<AddressFormData[]>([]);

  const currentAddress = typeModal === "edit" ? addressEdit : address;
  const { countries, states, cities } = useCountriesStatesCities(
    currentAddress.country,
    currentAddress.state
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
    if (typeModal === "add") {
      if (!address.firstName?.trim()) {
        newErrors.firstName = "Please enter your first name.";
      }
      if (!address.lastName?.trim()) {
        newErrors.lastName = "Please enter your last name";
      }
      if (!address.title?.trim()) {
        newErrors.title = "Please enter title address.";
      }
      if (!address.country?.trim()) {
        newErrors.country = "Please select country.";
      }
      if (!address.zipCode?.trim()) {
        newErrors.zipCode = "Please enter postal code.";
      } else if (!/^\d{4,10}$/.test(address.zipCode)) {
        newErrors.zipCode = "Please enter a valid postal code.";
      }
      if (!address.street?.trim()) {
        newErrors.street = "Please enter street.";
      }
      if (!address.phone?.trim()) {
        newErrors.phone = "Please enter phone number.";
      } else if (!/^[0-9+\-()\s]{6,20}$/.test(address.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
    }

    if (typeModal === "edit") {
      if (!addressEdit.firstName?.trim()) {
        newErrors.firstName = "Please enter your first name.";
      }
      if (!addressEdit.lastName?.trim()) {
        newErrors.lastName = "Please enter your last name";
      }
      if (!addressEdit.title?.trim()) {
        newErrors.title = "Please enter title address.";
      }
      if (!addressEdit.country?.trim()) {
        newErrors.country = "Please select country.";
      }
      if (!addressEdit.zipCode?.trim()) {
        newErrors.zipCode = "Please enter postal code.";
      } else if (!/^\d{4,10}$/.test(addressEdit.zipCode)) {
        newErrors.zipCode = "Please enter a valid postal code.";
      }
      if (!addressEdit.street?.trim()) {
        newErrors.street = "Please enter street.";
      }
      if (!addressEdit.phone?.trim()) {
        newErrors.phone = "Please enter phone number.";
      } else if (!/^[0-9+\-()\s]{6,20}$/.test(addressEdit.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }
    }

    setErrorsInput(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeAdd = <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K]
  ) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeEdit = <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K]
  ) => {
    setAddressEdit((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditAddress = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await addressApi.update(addressEdit.id!, {
        title: addressEdit.title,
        firstName: addressEdit.firstName,
        lastName: addressEdit.lastName,
        country: addressEdit.country,
        state: addressEdit.state,
        city: addressEdit.city,
        street: addressEdit.street,
        zipCode: addressEdit.zipCode,
        phone: addressEdit.phone,
        phoneCode: addressEdit.phoneCode,
        isDefault: addressEdit.isDefault,
      });

      fetchAddress();

      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }

      setNotify({
        ...notify,
        edit: { status: "success", message: "Address updated successfully!" },
      });
    } catch (err: any) {
      setNotify({
        ...notify,
        edit: { status: "fail", message: "Failed to update address!" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await addressApi.remove(id);
      setFetchedAddress((prev) => prev.filter((item) => item.id !== id));
      setIsShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAddress = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        ...address,
        isDefault: isCheckDefault,
        title: address.title,
        zipCode: address.zipCode,
      };
      await addressApi.create(payload);
      setNotify({
        ...notify,
        add: { status: "success", message: "Address created successfully!" },
      });
      setAddress({
        title: "",
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        zipCode: "",
        state: "",
        country: "",
        phoneCode: "+84",
        phone: "",
        isDefault: false,
      });

      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      fetchAddress();
    } catch (error: any) {
      setNotify({
        ...notify,
        add: { status: "fail", message: "Failed to create address!" },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await addressApi.getAll();
      const items: AddressFormData[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setFetchedAddress(items);
    } catch (error) {
      console.error("Failed to fetch Address:", error);
      return [];
    }
  };

  const handleStateChange = (newState: string) => {
    setAddressEdit((prev) => ({
      ...prev,
      state: newState,
      city: "",
    }));
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    if (notify.add.message || notify.edit.message) {
      const timer = setTimeout(() => {
        setNotify({
          add: { status: "", message: "" },
          edit: { status: "", message: "" },
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notify]);

  useEffect(() => {
    document.body.style.overflow = isShowModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isShowModal]);

  return (
    <>
      {isShowModal && typeModal === "setDefault" && (
        <div className="addresses-modal d-flex justify-center items-center fullsize">
          <Modal
            onClose={() => {
              setIsShowModal(false);
            }}
            isButton={false}
            isCancel={false}
            children={
              <div className="d-flex flex-col items-start">
                <p className="text-font-regular font-size-base">
                  Are you sure you want to set this address as the default?
                  <span className="text-font-semibold font-size-base ml-1">
                    {addressEdit.title}
                  </span>
                </p>
                <div className="d-flex flex-row justify-center items-center gap-3 width-fullsize mt-4">
                  <button
                    className="addresses-modal-button no text-font-semibold font-size-sm"
                    onClick={() => setIsShowModal(false)}
                  >
                    NO
                  </button>
                  <button
                    className="addresses-modal-button yes text-font-semibold font-size-sm"
                    onClick={() => {
                      handleEditAddress();
                      setIsShowModal(false);
                    }}
                  >
                    YES
                  </button>
                </div>
              </div>
            }
          />
        </div>
      )}

      {isShowModal && typeModal === "add" && (
        <div className="addresses-modal d-flex justify-center items-center fullsize">
          <Modal
            onClose={() => {
              setIsShowModal(false);
            }}
            title="ADD NEW ADDRESS"
            namebtn={loading ? "LOADING..." : "ADD NEW ADDRESS"}
            onClick={handleCreateAddress}
            isCancel
            children={
              <div ref={modalRef} className="d-flex flex-col p-3">
                {notify.add.message && (
                  <div
                    className={`addresses-notify ${
                      notify.add.status === "success" ? "success" : "fail"
                    } d-flex flex-row text-start justify-start mb-3 mt-3`}
                  >
                    <p className="text-font-regular font-size-sm">
                      {notify.add.message}
                    </p>
                  </div>
                )}
                <Input
                  label="ADDRESS TITLE"
                  id={"title"}
                  type={"text"}
                  value={address.title}
                  onChange={(e) => handleChangeAdd("title", e.target.value)}
                  required
                />
                {errorsInput.title && (
                  <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                    {errorsInput.title}
                  </p>
                )}
                <div className="d-flex flex-row width-fullsize gap-3 mt-3">
                  <div className="width-fullsize">
                    <Input
                      id={"firstname"}
                      label={"First Name"}
                      type="text"
                      value={address.firstName}
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
                      value={address.lastName}
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
                    value={currentAddress.country}
                    onChange={(e) => handleChangeAdd("country", e.target.value)}
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
                      value={address.state ? address.state : ""}
                      options={states.map((s) => [s.isoCode, s.name])}
                      onChange={(e) => handleChangeAdd("state", e.target.value)}
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
                      value={address.city}
                      options={cities.map((c) => [c.name, c.name])}
                      onChange={(e) => handleChangeAdd("city", e.target.value)}
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
                      value={address.street}
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
                      value={address.zipCode}
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
                          value={address.phoneCode}
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
                        value={address.phone}
                        onChange={(e) =>
                          handleChangeAdd("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    {errorsInput.phone && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                        {errorsInput.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <CheckBox
                    isCheck={isCheckDefault}
                    titleBtn={"Make default"}
                    setIsCheck={setIsCheckDefault}
                    classNameContainer="items-center"
                  />
                </div>
              </div>
            }
          />
        </div>
      )}

      {isShowModal && typeModal === "delete" && (
        <div className="addresses-modal d-flex justify-center items-center fullsize">
          <Modal
            onClose={() => {
              setIsShowModal(false);
            }}
            isButton={false}
            isCancel={false}
            children={
              <div className="d-flex flex-col items-start">
                <p className="text-font-regular font-size-base">
                  Are you sure you want to remove the following address?
                  <span className="text-font-semibold font-size-base ml-1">
                    {addressEdit.title}
                  </span>
                </p>
                <div className="d-flex flex-row justify-center items-center width-fullsize mt-4">
                  <button
                    className="addresses-modal-button no text-font-semibold font-size-sm"
                    onClick={() => setIsShowModal(false)}
                  >
                    NO
                  </button>
                  <button
                    className="addresses-modal-button yes text-font-semibold font-size-sm ml-3"
                    onClick={() => handleDeleteAddress(addressEdit.id!)}
                  >
                    YES
                  </button>
                </div>
              </div>
            }
          />
        </div>
      )}

      {isShowModal && typeModal === "edit" && (
        <div className="addresses-modal d-flex justify-center items-center fullsize">
          <Modal
            onClose={() => {
              setIsShowModal(false);
            }}
            title="Edit address"
            namebtn={loading ? "LOADING..." : "UPDATE ITEM"}
            onClick={handleEditAddress}
            isCancel
            children={
              <div ref={modalRef} className="d-flex flex-col p-3">
                {notify.edit.message && (
                  <div
                    className={`addresses-notify ${
                      notify.edit.status === "success" ? "success" : "fail"
                    } d-flex flex-row text-start justify-start mb-3`}
                  >
                    <p className="text-font-regular font-size-sm">
                      {notify.edit.message}
                    </p>
                  </div>
                )}
                <Input
                  label="ADDRESS TITLE"
                  id={"title"}
                  type={"text"}
                  value={addressEdit.title}
                  onChange={(e) => handleChangeEdit("title", e.target.value)}
                  required
                />
                {errorsInput.title && (
                  <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                    {errorsInput.title}
                  </p>
                )}
                <div className="d-flex flex-row width-fullsize gap-3 mt-3">
                  <div className="width-fullsize">
                    <Input
                      id={"firstname"}
                      label={"First Name"}
                      type="text"
                      value={addressEdit.firstName}
                      required
                      onChange={(e) =>
                        handleChangeEdit("firstName", e.target.value)
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
                      value={addressEdit.lastName}
                      required
                      onChange={(e) =>
                        handleChangeEdit("lastName", e.target.value)
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
                    value={addressEdit.country}
                    onChange={(e) =>
                      handleChangeEdit("country", e.target.value)
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
                      value={addressEdit.state}
                      options={states.map((s) => [s.isoCode, s.name])}
                      onChange={(e) => handleStateChange(e.target.value)}
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
                      value={addressEdit.city}
                      options={cities.map((c) => [c.name, c.name])}
                      onChange={(e) => handleChangeEdit("city", e.target.value)}
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
                      value={addressEdit.street}
                      onChange={(e) =>
                        handleChangeEdit("street", e.target.value)
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
                      value={addressEdit.zipCode}
                      onChange={(e) =>
                        handleChangeEdit("zipCode", e.target.value)
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
                          value={addressEdit.phoneCode}
                          options={countryCallingCodes.map((c) => [
                            `+${c.countryCodes[0]}`,
                            `${c.isoCode2} (+${c.countryCodes[0]})`,
                          ])}
                          onChange={(e) =>
                            handleChangeEdit("phoneCode", e.target.value)
                          }
                        />
                      </div>
                      <Input
                        id={"phone"}
                        type="tel"
                        label={"Phone"}
                        value={addressEdit.phone}
                        onChange={(e) =>
                          handleChangeEdit("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    {errorsInput.phone && (
                      <p className="text-font-regular font-size-sm text-start text-red-500 mt-2 ml-1">
                        {errorsInput.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <CheckBox
                    isCheck={addressEdit.isDefault}
                    titleBtn={"Make default"}
                    setIsCheck={(checked: boolean) =>
                      setAddressEdit((prev) => ({
                        ...prev,
                        isDefault: checked,
                      }))
                    }
                    classNameContainer="items-center"
                  />
                </div>
              </div>
            }
          />
        </div>
      )}

      <Overview
        activeNumber={3}
        content={
          <div className="addresses d-flex flex-col items-start width-fullsize">
            <p className="text-font-bold font-size-xl">ADDRESSES</p>
            <div
              className="addresses-add d-flex flex-col justify-center items-center width-fullsize mt-4"
              onClick={() => {
                setIsShowModal(true);
                setTypeModal("add");
              }}
            >
              <img src={ICONS.add} alt="" className="addresses-add-icon" />
              <p className="text-font-semibold font-size-md mt-2">
                ADD NEW ADDRESS
              </p>
            </div>
            <div className="addresses-box-container width-fullsize mt-4">
              {fetchedAddress && fetchedAddress.length > 0 ? (
                [...fetchedAddress]
                  .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
                  .map((item: AddressFormData) => (
                    <div
                      key={item.id}
                      className="addresses-box d-flex flex-col width-fullsize mr-3"
                    >
                      <div className="d-flex flex-row justify-between width-fullsize">
                        <div className="d-flex flex-row items-center">
                          <p className="text-font-semibold font-size-md">
                            {item.title}
                          </p>
                          {item.isDefault && (
                            <p className="text-font-light-italic font-size-sm ml-1">
                              (default)
                            </p>
                          )}
                        </div>
                        <div className="d-flex flex-row">
                          <img
                            src={ICONS.edit}
                            alt=""
                            className="addresses-box-icon"
                            onClick={() => {
                              setAddressEdit({ ...item });
                              setIsShowModal(true);
                              setTypeModal("edit");
                            }}
                          />
                          <img
                            src={ICONS.trash}
                            alt=""
                            className="addresses-box-icon ml-2"
                            onClick={() => {
                              setAddressEdit({ ...item });
                              setIsShowModal(true);
                              setTypeModal("delete");
                            }}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-col items-start text-font-regular font-size-sm mt-3">
                        <p>
                          {item.firstName} {item.lastName}
                        </p>
                        <p>
                          {item.phoneCode}
                          {item.phone}
                        </p>
                        <p>{item.street}</p>
                        <p>
                          {item.city}
                          {item.city && ", "}
                          {states.find((s) => s.isoCode === item.state)?.name ||
                            ""}
                        </p>
                        <p>{item.zipCode}</p>
                        <p>{item.country}</p>
                      </div>
                      {!item.isDefault && (
                        <div className="d-flex items-start text-font-semibold font-size-base mt-3">
                          <Button
                            label={"SET AS DEFAULT ADDRESS"}
                            variant="static-underline"
                            onClick={() => {
                              setIsShowModal(true);
                              setTypeModal("setDefault");
                              setAddressEdit({
                                ...item,
                                isDefault: true,
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-font-regular font-size-sm text-start">
                  You haven't added any addresses yet.
                </p>
              )}
            </div>
          </div>
        }
      />
    </>
  );
};
