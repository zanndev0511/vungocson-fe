export interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface LoginForm {
  email: string;
  password: string;
  isRememberMe: boolean;

}
