import type { ApiResponse } from "@api/common";
import type { NewsData } from "@interfaces/components/news";
import axiosClient from "../index";

const newsApi = {
  getAll: (): Promise<ApiResponse<NewsData[]>> => axiosClient.get("/news"),

  getById: (id: string): Promise<NewsData> =>
    axiosClient.get(`/news/${id}`).then((res) => res.data),

};

export default newsApi;
