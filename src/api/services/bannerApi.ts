import { ApiResponse, ListResponse } from "@api/common";
import axiosClient from "../index";
import { Banners } from "@interfaces/components/banner";

const bannerApi = {
  getAll: (): Promise<ApiResponse<ListResponse<Banners>>> =>
    axiosClient.get("/banners"),
};

export default bannerApi;
