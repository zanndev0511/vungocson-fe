import ordersApi from "@api/services/ordersApi";
import { Select } from "@components/common/Select";
import type { DateChangeHandlers } from "@interfaces/pages/myOrders";
import type { Order } from "@interfaces/pages/order";
import { Overview } from "@pages/Overview";
import "@styles/pages/myOrders.scss";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { toast } from "react-toastify";

export const MyOrders: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [valueCalendar, setValueCalendar] = useState<
    Date | [Date | null, Date | null] | null
  >(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const optionsCalen: [string, string][] = [
    ["today", "Today"],
    ["7months", "Last 7 days"],
    ["30months", "Last 30 days"],
    [
      "custom",
      Array.isArray(valueCalendar) && valueCalendar[0] && valueCalendar[1]
        ? `${valueCalendar[0].toLocaleDateString(
            "en-US"
          )} - ${valueCalendar[1].toLocaleDateString("en-US")}`
        : "Custom range",
    ],
  ];

  const statusButton: Array<string> = [
    "All",
    "Wait for confirmation",
    "Confirmed",
    "Delivered",
    "Canceled",
  ];

  const fetchOrders = async () => {
    try {
      const res = await ordersApi.getByUserId();
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const mapLabelToStatus = (label: string): string => {
    switch (label) {
      case "All":
        return "all";
      case "Wait for confirmation":
        return "awaiting_confirmation";
      case "Confirmed":
        return "confirmed";
      case "Canceled":
        return "canceled";
      case "Delivered":
        return "delivered";
      default:
        return "all";
    }
  };

  const getStatusCount = (statusLabel: string) => {
    const status = mapLabelToStatus(statusLabel);
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  const handleConfirm = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await ordersApi.confirmOrderCustomer(orderId);
      if (res.success) {
        fetchOrders();
        toast.success(
          "Thank you! You have successfully confirmed receipt of your order.",
          {
            className: "result-toast text-font-regular font-size-sm",
            autoClose: 5000,
            position: "top-center",
          }
        );
      } else {
        toast.error(
          "This order cannot be confirmed. It may have already been completed.",
          {
            className: "result-toast text-font-regular font-size-sm",
            autoClose: 5000,
            position: "top-center",
          }
        );
      }
    } catch (error: any) {
      toast.error(
        "This order cannot be confirmed. It may have already been completed.",
        {
          className: "result-toast text-font-regular font-size-sm",
          autoClose: 5000,
          position: "top-center",
        }
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const created = new Date(order.createdAt);
        return created >= startDate && created <= endDate;
      });
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }
    setFilteredOrders(filtered);
  }, [orders, startDate, endDate, selectedStatus]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setOpenCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Overview
      activeNumber={1}
      content={
        <div className="myOrders d-flex flex-col items-start width-fullsize">
          <p className="text-font-bold font-size-xl">MY ORDERS</p>
          <div className="d-flex flex-col width-fullsize">
            <div className="d-flex flex-col justify-center items-start mt-3">
              <div className="myOrders-select mt-2">
                <Select
                  label="Select Date"
                  value={selectedOption}
                  options={optionsCalen}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  onClick={() => {
                    if (selectedOption === "custom") {
                      setOpenCalendar(true);
                    }
                  }}
                  required
                />
              </div>
              <div className="mt-1 width-fullsize">
                {selectedOption === "custom" && openCalendar && (
                  <div
                    className="myOrders-select-calendar text-font-regular p-4"
                    ref={calendarRef}
                  >
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
                    <div className="width-fullsize mt-3">
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
          <div className="myOrders-button-line-container width-fullsize mt-4">
            {statusButton.map((label, index) => (
              <div
                key={index}
                className="myOrders-button-line-wrap d-flex flex-col items-center justify-center text-font-light font-size-sm cursor-pointer"
                onClick={() => setSelectedStatus(mapLabelToStatus(label))}
              >
                <p>{label}</p>
                <div
                  className={`myOrders-button-line ${
                    selectedStatus === mapLabelToStatus(label) ? "active" : ""
                  }`}
                />
                {getStatusCount(label) > 0 && (
                  <div className="myOrders-button-line-count d-flex justify-center items-center">
                    <p className="text-font-regular font-size-xs">
                      {getStatusCount(label)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="d-flex flex-col justify-center align-center width-fullsize">
            {filteredOrders.length === 0 && (
              <p className="text-font-semibold font-size-sm p-5">
                No orders found.
              </p>
            )}
            {filteredOrders.map((item, index) => (
              <div key={index} className="myOrders-box mt-4">
                <div className="myOrders-box-status-wrap justify-between">
                  <div className="d-flex flex-row justify-start items-center gap-1">
                    <p className="text-font-semibold font-size-sm text-start">
                      ID:
                    </p>
                    <p className="text-font-semibold font-size-sm text-start">
                      {item.id}
                    </p>
                  </div>

                  <div className="d-flex items-center gap-2">
                    <div className="d-flex flex-row justify-start items-center gap-1">
                      <p className="text-font-semibold font-size-sm text-start">
                        Latest update:
                      </p>
                      <p className="text-font-regular font-size-sm text-start">
                        {new Date(item.updatedAt).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <p className="text-font-regular font-size-sm">|</p>
                    <div className="d-flex gap-1">
                      <p
                        className={`text-font-semibold font-size-sm text-start ${
                          item.status === "pending"
                            ? "text-yellow-500"
                            : item.status === "awaiting_confirmation"
                            ? "text-blue-500"
                            : item.status === "confirmed"
                            ? "text-green-500"
                            : item.status === "canceled"
                            ? "text-red-500"
                            : item.status === "delivered"
                            ? "text-purple-500"
                            : ""
                        }`}
                      >
                        {item.status.replace(/_/g, " ").toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="myOrders-box-line" />

                {item.items.map((product, idx) => (
                  <div key={idx} className="d-flex flex-col">
                    <div className="myOrders-box-product-wrap d-flex flex-row width-fullsize gap-3">
                      <div className="myOrders-box-image-wrap">
                        <img
                          src={product.product?.productGallery?.[0]}
                          alt={product.product?.name || ""}
                          className="myOrders-box-image"
                        />
                      </div>

                      <div className="myOrders-box-product-infor d-flex flex-col items-start width-fullsize gap-1">
                        <p className="text-font-semibold font-size-sm text-uppercase text-start">
                          {product.product.name}
                        </p>
                        <div className="d-flex flex-row justify-start items-center">
                          <p className="myOrders-box-label text-font-semibold font-size-sm text-start">
                            Color :
                          </p>
                          <p className="text-font-regular font-size-sm text-capitalize text-start">
                            {product.color}
                          </p>
                        </div>
                        <div className="d-flex flex-row justify-start items-center">
                          <p className="myOrders-box-label text-font-semibold font-size-sm text-start">
                            Size :
                          </p>
                          <p className="text-font-regular font-size-sm text-capitalize text-start">
                            {product.size}
                          </p>
                        </div>
                        <div className="d-flex flex-row justify-start items-center">
                          <p className="myOrders-box-label text-font-semibold font-size-sm text-start">
                            Quantity :
                          </p>
                          <p className="text-font-regular font-size-sm text-capitalize text-start">
                            {product.quantity}
                          </p>
                        </div>
                        <div className="d-flex flex-row justify-start items-center">
                          <p className="myOrders-box-label text-font-semibold font-size-sm text-start">
                            Order date:
                          </p>
                          <p className="myOrders-box-product-infor-date text-font-regular text-capitalize text-start">
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="myOrders-box-product-infor-price text-font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.price)}
                      </p>
                    </div>

                    <div className="myOrders-box-line" />
                  </div>
                ))}
                <div
                  className={`myOrders-box-product-infor-price-total d-flex ${
                    item.status === "confirmed"
                      ? "justify-between"
                      : "justify-end"
                  } items-center`}
                >
                  {item.status === "confirmed" && (
                    <div
                      className="myOrders-button-wrap"
                      onClick={() => handleConfirm(item.id)}
                    >
                      <p className="text-font-semibold font-size-sm">
                        {loading ? "Confirming..." : "Confirm Delivery"}
                      </p>
                    </div>
                  )}

                  <p className="myOrders-box-product-infor-price text-font-semibold">
                    Total:
                    <span className="ml-4">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        Number(item.subtotal) + Number(item.shippingfee)
                      )}
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
