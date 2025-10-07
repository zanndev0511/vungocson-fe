export interface Users {
  id: string;
  lastname: string | null;
  firstname: string | null;
  title: string;
  birthday: string | null;
  provider?: "local" | "google" | "facebook";
  email: string;
}

export interface UsersForm {
  email: string;
  password: string;
  title: string;
  firstname: string;
  lastname: string;
  birthday: string;
}
