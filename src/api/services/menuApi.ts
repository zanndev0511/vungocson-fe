import axiosClient from "../index";
import type { ApiResponse, ListResponse } from "@api/common";
import type { MenuSideBar } from "@interfaces/components/sideBar";

const menuApi = {
  getAll: (): Promise<ApiResponse<ListResponse<MenuSideBar>>> =>
    axiosClient.get("/menus"),
};

export default menuApi;
