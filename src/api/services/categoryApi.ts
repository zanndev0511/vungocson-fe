import { ApiResponse, ListResponse } from "@api/common";
import { Category } from "@interfaces/pages/category";
import axiosClient from "../index";

const categoryApi = {
  getAll: (): Promise<ApiResponse<ListResponse<Category>>> =>
    axiosClient.get("/categories"),

  getById: (id: string): Promise<Category> =>
    axiosClient.get(`/categories/${id}`).then((res) => res.data),
};

export default categoryApi;
