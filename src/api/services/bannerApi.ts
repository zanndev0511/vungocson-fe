import type { ApiResponse, ListResponse } from "@api/common";
import axiosClient from "../index";
import type { Banners } from "@interfaces/components/banner";

const bannerApi = {
  getAll: (): Promise<ApiResponse<ListResponse<Banners>>> =>
    axiosClient.get("/banners"),
};

export default bannerApi;
