import { ApiResponse } from "@api/common";
import axiosClient from "../index";
import { Users } from "@interfaces/pages/users";
import { ProfileForm } from "@interfaces/pages/account";

const usersApi = {
  updateProfile: (id: string, data: Partial<ProfileForm>): Promise<ApiResponse<Users>> =>
    axiosClient.patch(`/users/edit/profile/${id}`, data),
};

export default usersApi;
