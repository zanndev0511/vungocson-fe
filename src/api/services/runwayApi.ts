import type { ApiResponse, ListResponse } from "@api/common";
import axiosClient from "../index";
import type { Runway } from "@interfaces/pages/runway";


const runwayApi = {
  getAll: (): Promise<ApiResponse<ListResponse<Runway>>> =>
    axiosClient.get("/runways"),

  getById: (id: string): Promise<Runway> =>
    axiosClient.get<Runway>(`/runways/${id}`).then((res) => res.data),

  getFeatured: (): Promise<Runway> =>
    axiosClient.get<Runway>("/runways/featured").then((res) => res.data),
};

export default runwayApi;
