export interface InputProps {
     id: string;
  label?: string;
  placeholder?: string;
  value?: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  readonly?: boolean;
  className?: string;
  classNameLabel?: string;
}
export {};