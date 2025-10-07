import type { ApiResponse } from "@api/common";
import type { AboutData } from "@interfaces/pages/about";
import axiosClient from "../index";

const aboutApi = {
  get: (): Promise<ApiResponse<AboutData>> => axiosClient.get("/about"),
};

export default aboutApi;
