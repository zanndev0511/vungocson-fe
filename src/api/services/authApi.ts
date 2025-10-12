import type { ApiResponse, User } from "@api/common";
import axiosClient from "../index";
import type { RegisterForm } from "@interfaces/pages/register";
import type { LoginForm } from "@interfaces/pages/login";
import Cookies from "js-cookie";
import type { Users } from "@interfaces/pages/users";
import rawAxios from "@api/raw";

const authApi = {
  register: (
    data: RegisterForm
  ): Promise<ApiResponse<{ message: string; userId: string }>> =>
    axiosClient.post("/auth/register", data),

  login: async (data: LoginForm) => {
    await axiosClient.post("/auth/login", data);
  },

  refresh: async () => {
    await rawAxios.post("/auth/refresh");
  },

  logout: async () => {
    await axiosClient.post("/auth/logout");
  },

  getProfile: async (): Promise<Users> => {
    const res = await axiosClient.get("/auth/me");
    return res.data;
  },

  loginWithFacebook: (): void => {
    const fbLoginUrl = `${import.meta.env.VITE_API_URL}/auth/facebook`;
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const fbWindow = window.open(
      fbLoginUrl,
      "Facebook Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_API_URL) return;

      const { accessToken, user } = event.data;
      if (accessToken) {
        Cookies.set("accessToken", accessToken);
        Cookies.set("name", user.name);
        fbWindow?.close();
        window.removeEventListener("message", handleMessage);
        axiosClient.get("/auth/me")
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage);
  },

  logoutFb: (accessToken: string) => {
    const redirectUrl = window.location.origin;
    window.location.href = `https://www.facebook.com/logout.php?next=${redirectUrl}&access_token=${accessToken}`;
  },

  loginWithGoogle: (): void => {
    const googleLoginUrl = `${import.meta.env.VITE_API_URL}/auth/google`;
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const googleWindow = window.open(
      googleLoginUrl,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const handleMessage = (event: MessageEvent) => {
      const { accessToken, user } = event.data;
      if (accessToken && user) {
        Cookies.set("accessToken", accessToken);
        Cookies.set("name", user.name);
        window.location.reload();
        googleWindow?.close();
        window.removeEventListener("message", handleMessage);
      }
    };
    window.addEventListener("message", handleMessage);
  },

  handleGoogleCallback: (): Promise<
    ApiResponse<{ accessToken: string; user: User }>
  > => axiosClient.get("/auth/google/callback"),

  forgotPassword: (data: { email: string }) =>
    axiosClient.post(
      `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
      data
    ),
  resetPassword: (data: { token: string; newPassword: string }) =>
    axiosClient.post(
      `${import.meta.env.VITE_API_URL}/auth/reset-password`,
      data
    ),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    axiosClient.post(
      `${import.meta.env.VITE_API_URL}/auth/change-password`,
      data
    ),
};

export default authApi;
