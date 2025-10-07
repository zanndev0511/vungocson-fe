import type { ApiResponse } from "@api/common";
import axiosClient from "../index";
import type {
  AddToCartPayload,
  CartItem,
  EditCartPayload,
  RemoveFromCartPayload,
} from "@interfaces/pages/cart";

const cartApi = {
  getAll: (): Promise<ApiResponse<CartItem[]>> => axiosClient.get("/cart"),

  add: (payload: AddToCartPayload): Promise<ApiResponse<CartItem>> =>
    axiosClient.post("/cart/add", payload),

  remove: (payload: RemoveFromCartPayload): Promise<ApiResponse<CartItem>> =>
    axiosClient.delete(`/cart/remove/${payload.cartItemId}`, { data: payload }),

  edit: (payload: EditCartPayload): Promise<ApiResponse<CartItem>> =>
    axiosClient.patch(`/cart/${payload.cartItemId}`, {
      quantity: payload.quantity,
    }),
};

export default cartApi;
