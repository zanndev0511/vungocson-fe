import { ApiResponse } from "@api/common";
import axiosClient from "../index";
import { WishlistItem, AddToWishlistPayload } from "@interfaces/pages/wishlist";

const wishlistApi = {
  getAll: (): Promise<ApiResponse<WishlistItem[]>> =>
    axiosClient.get("/wishlist"),

  add: (payload: AddToWishlistPayload): Promise<ApiResponse<WishlistItem>> =>
    axiosClient.post("/wishlist/add", payload),

  remove: (productId: string): Promise<ApiResponse<WishlistItem>> =>
  axiosClient.delete(`/wishlist/remove/${productId}`)

};

export default wishlistApi;
