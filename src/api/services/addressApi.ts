
import type { ApiResponse, ListResponse } from "@api/common";
import axiosClient from "../index";
import type { AddressFormData } from "@interfaces/pages/addresses";

const addressApi = {
  getAll: (): Promise<ApiResponse<ListResponse<AddressFormData>>> =>
    axiosClient.get("/addresses"),

  getById: (id: string): Promise<ApiResponse<AddressFormData>> =>
    axiosClient.get(`/addresses/${id}`),

  create: (data: AddressFormData): Promise<ApiResponse<AddressFormData>> =>
    axiosClient.post("/addresses", data),

  update: (
    id: string,
    data: AddressFormData
  ): Promise<ApiResponse<AddressFormData>> =>
    axiosClient.patch(`/addresses/${id}`, data),

  remove: (id: string): Promise<ApiResponse<void>> =>
    axiosClient.delete(`/addresses/remove/${id}`),
};

export default addressApi;
