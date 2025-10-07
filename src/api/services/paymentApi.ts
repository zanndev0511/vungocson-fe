import type { ApiResponse } from "@api/common";
import axiosClient from "../index";
import type {
  BraintreeClientTokenResponse,
  BraintreeTransactionResponse,
  PaypalCaptureResponse,
  PaypalOrderResponse,
} from "@interfaces/pages/payment";

const paymentApi = {
  getClientToken: (): Promise<ApiResponse<BraintreeClientTokenResponse>> =>
    axiosClient.get("/payment/client-token"),

  createTransaction: (
    amount: number,
    taxRate: number,
    shippingfee: number,
    paymentMethodNonce: string,
    customerName?: string,
    addresses?: {
      shippingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
        phoneCode?: string;
        phone?: string;
      };
      billingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        street2?: string;
        city: string;
        state: string;
        country: string;
        phoneCode?: string;
        phone?: string;
        phoneCode2?: string;
        phone2?: string;
        zipcode: string;
      };
    }
  ): Promise<ApiResponse<BraintreeTransactionResponse>> =>
    axiosClient.post("/payment/checkout", {
      amount,
      taxRate,
      shippingfee,
      paymentMethodNonce,
      customerName,
      addresses,
    }),

  createPaypalOrder: (
    amount: number,
    currency?: string
  ): Promise<ApiResponse<PaypalOrderResponse>> =>
    axiosClient.post("/payment/paypal/create-order", { amount, currency }),

  capturePaypalOrder: (
    orderId: string,
    taxRate: number,
    shippingfee: number,
    shippingAddress: any
  ): Promise<ApiResponse<PaypalCaptureResponse>> =>
    axiosClient.post("/payment/paypal/capture-order", {
      orderId,
      shippingAddress,
      taxRate,
      shippingfee,
    }),
};

export default paymentApi;
