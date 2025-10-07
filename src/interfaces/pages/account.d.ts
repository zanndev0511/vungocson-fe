export interface ProfileForm {
  lastname: string | null;
  firstname: string | null;
  title: string;
  birthday: string | null;
}
export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
}

export interface Notify {
  profile: NotifyItem;
  password: NotifyItem;
}

export interface NotifyItem {
  status: "success" | "fail" | "";
  message: string;
}
