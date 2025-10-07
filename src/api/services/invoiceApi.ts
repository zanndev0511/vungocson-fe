import { ApiResponse } from "@api/common";
import { InvoiceResponse } from "@interfaces/pages/payment";
import axiosClient from "../index";

export const invoiceApi = {
   createAndSend: (orderId: string): Promise<ApiResponse<InvoiceResponse>> =>
    axiosClient.post("/invoice/create-and-send", { orderId }),
};
