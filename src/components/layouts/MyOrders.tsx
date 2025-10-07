import { ICONS } from "@constants/icons";
import { IMAGES } from "@constants/image";
import type { DateChangeHandlers } from "@interfaces/pages/myOrders";
import { Overview } from "@pages/Overview";
import "@styles/pages/myOrders.scss";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";

export const MyOrders: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [valueCalendar, setValueCalendar] = useState<
    Date | [Date | null, Date | null] | null
  >(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState<Number>(0);

  const statusButton: Array<String> = [
    "All",
    "Wait for payment",
    "Shipping",
    "Waiting for delivery",
    "Complete",
    "Canceled",
  ];

  console.log(startDate);
  console.log(endDate);

  const ordersItems = [
    {
      id: "051103",
      latest: "05/11/2003",
      status: "Delivered successfully",
      name: "“HOA GIAY” – EMBROIDERED PRINCESS DRESS",
      image: IMAGES.happyForever1,
      color: "Orange",
      size: "S",
      quantity: 1,
      price: 1.45,
    },
    {
      id: "051104",
      latest: "05/11/2003",
      status: "Delivered successfully",
      name: "“HOA GIAY” – EMBROIDERED PRINCESS DRESS",
      image: IMAGES.happyForever2,
      color: "Orange",
      size: "S",
      quantity: 1,
      price: 1.45,
    },
  ];

  type DateValue = Date | [Date | null, Date | null] | null;

  const handleDateChange = (val: DateValue, handlers: DateChangeHandlers) => {
    const { setValueCalendar, setStartDate, setEndDate } = handlers;

    if (Array.isArray(val)) {
      const [start, end] = val;
      if (start instanceof Date && end instanceof Date) {
        setValueCalendar([start, end]);
        setStartDate(start);
        setEndDate(end);
        setOpenCalendar(false);
      } else {
        setValueCalendar(null);
        setStartDate(null);
        setEndDate(null);
      }
    } else if (val instanceof Date) {
      setValueCalendar(val);
      setStartDate(val);
      setEndDate(null);
    } else {
      setValueCalendar(null);
      setStartDate(null);
      setEndDate(null);
    }
  };

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };

  useEffect(() => {
    if (selectedOption === "custom") {
      setOpenCalendar(true);
    } else {
      setOpenCalendar(false);
      setValueCalendar([null, null]);
      setStartDate(null);
      setEndDate(null);
    }
  }, [selectedOption]);

  return (
    <Overview
    activeNumber={1}
      content={
        <div className="d-flex flex-col items-start width-fullsize p-5">
          <p className="text-font-bold font-size-xl">MY ORDERS</p>
          <div className="d-flex flex-col width-fullsize">
            <div className="d-flex flex-col justify-center items-start mt-3">
              <p className="text-uppercase text-font-regular font-size-sm">
                Select Date
              </p>
              <div className="myOrders-select mt-2">
                <select
                  className="myOrders-select-date"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  onClick={() => {
                    if (selectedOption === "custom") {
                      setOpenCalendar(true);
                    }
                  }}
                  required
                >
                  <option value="today">Today</option>
                  <option value="7months">Last 7 days</option>
                  <option value="30months">Last 30 days</option>
                  <option value="custom">
                    {Array.isArray(valueCalendar) &&
                    valueCalendar[0] &&
                    valueCalendar[1]
                      ? `${valueCalendar[0].toLocaleDateString(
                          "en-US"
                        )} - ${valueCalendar[1].toLocaleDateString("en-US")}`
                      : "Custom range"}
                  </option>
                </select>
              </div>
              <div className="mt-1 width-fullsize">
                {selectedOption === "custom" && openCalendar && (
                  <div className="myOrders-select-calendar text-font-regular p-4">
                    <div className="d-flex flex-row justify-center items-center text-font-semibold font-size-md">
                      <p
                        className="myOrders-select-calendar-control"
                        onClick={goToPrevMonth}
                      >
                        &lt;
                      </p>
                      <p className="ml-3 mr-3">
                        {currentMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p
                        className="myOrders-select-calendar-control"
                        onClick={goToNextMonth}
                      >
                        &gt;
                      </p>
                    </div>
                    <div className="mt-3">
                      <Calendar
                        showNavigation={false}
                        selectRange={true}
                        activeStartDate={currentMonth}
                        value={valueCalendar}
                        formatShortWeekday={(locale, date) =>
                          date.toLocaleDateString(locale, { weekday: "short" })
                        }
                        onActiveStartDateChange={({ activeStartDate }) => {
                          if (activeStartDate) setCurrentMonth(activeStartDate);
                        }}
                        onChange={(val) =>
                          handleDateChange(val, {
                            setValueCalendar,
                            setStartDate,
                            setEndDate,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-center items-center width-fullsize mt-4">
            {statusButton.map((label, index) => (
              <div
                key={index}
                className="d-flex flex-col items-center justify-center text-font-light font-size-base myOrders-button mr-4 cursor-pointer"
                onClick={() => setActiveTab(index)}
              >
                <p>{label}</p>
                <div
                  className={`myOrders-button-line ${
                    activeTab === index ? "active" : ""
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="d-flex flex-col justify-center align-center width-fullsize p-4">
            {ordersItems.map((item, index) => (
              <div key={index} className="myOrders-box mt-4">
                <div className="d-flex flex-row justify-between p-3">
                  <p className="text-font-semibold font-size-base">
                    ID: <span className="ml-2">{item.id}</span>
                  </p>
                  <div className="d-flex justify-center items-center">
                    <p className="text-font-semibold font-size-base">
                      Latest update:
                      <span className="text-font-regular ml-2">
                        {item.latest}
                      </span>
                    </p>
                    <p className="text-font-regular font-size-base ml-2">|</p>
                    <div className="d-flex ml-2">
                      <img src={ICONS.truck} alt=" " />
                      <p className="text-font-semibold font-size-base myOrders-box-status ml-2">
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="myOrders-box-line" />

                <div className="d-flex flex-row p-4 width-fullsize">
                  <img src={item.image} alt=" " width={120} height={180} />
                  <div className="d-flex flex-col items-start width-fullsize ml-4 mt-2">
                    <p className="text-font-semibold font-size-md text-uppercase">
                      {item.name}
                    </p>
                    <p className="text-font-regular font-size-base mt-2">
                      Color :
                      <span className="text-font-semibold text-capitalize">
                        {item.color}
                      </span>
                    </p>
                    <p className="text-font-regular font-size-base mt-2">
                      Size :
                      <span className="text-font-semibold text-capitalize">
                        {item.size}
                      </span>
                    </p>
                    <p className="text-font-regular font-size-base mt-2">
                      Quantity :
                      <span className="text-font-semibold">
                        {item.quantity}
                      </span>
                    </p>
                  </div>
                  <p className="text-font-semibold font-size-md">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.price)}
                  </p>
                </div>
                <div className="myOrders-box-line" />
                <div className="d-flex justify-end items-center pt-3 pr-4">
                  <p className="text-font-bold font-size-md">
                    TOTAL:
                    <span className="ml-4">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.price * item.quantity)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
};
