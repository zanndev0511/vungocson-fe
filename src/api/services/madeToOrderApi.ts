import type { ApiResponse, ListResponse } from "@api/common";
import axiosClient from "../index";
import type { MadeToOrderForm } from "@interfaces/pages/madeToOrder";

const madeToOrderApi = {
  getAll: (): Promise<ApiResponse<ListResponse<MadeToOrderForm>>> =>
    axiosClient.get("/made-to-order"),

  create: (data: MadeToOrderForm): Promise<ApiResponse<MadeToOrderForm>> =>
    axiosClient.post("/made-to-order", data),
};

export default madeToOrderApi;
