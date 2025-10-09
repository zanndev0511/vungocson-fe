import axiosClient from "../index";
import type { ApiResponse, ListResponse } from "@api/common";
import type { Order } from "@interfaces/pages/order";

const ordersApi = {

getByUserId: (): Promise<ApiResponse<ListResponse<Order>>> =>
  axiosClient.get("/orders/me"),

confirmOrderCustomer: (orderId: string): Promise<ApiResponse<{ message: string }>> =>
    axiosClient.get(`orders/customer-confirm-fe/${orderId}`),
};

export default ordersApi;
