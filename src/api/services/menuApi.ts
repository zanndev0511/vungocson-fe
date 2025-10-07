import axiosClient from "../index";
import { ApiResponse, ListResponse } from "@api/common";
import { MenuSideBar } from "@interfaces/components/sideBar";

const menuApi = {
  getAll: (): Promise<ApiResponse<ListResponse<MenuSideBar>>> =>
    axiosClient.get("/menus"),
};

export default menuApi;
