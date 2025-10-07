export interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'hover-underline' | 'static-underline';
  disabled?: boolean;
  className?: string;
}
export {};