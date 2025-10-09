import type { ApiResponse, ListResponse } from "@api/common";
import axiosClient from "../index";
import type { Collection } from "@interfaces/pages/collections";

const collectionApi = {
  getAll: (): Promise<ApiResponse<ListResponse<Collection>>> =>
    axiosClient.get("/collections"),

  getById: (id: string): Promise<Collection> =>
    axiosClient.get<Collection>(`/collections/${id}`).then((res) => {
      return res.data;
    }),
};

export default collectionApi;
