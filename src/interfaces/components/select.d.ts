export interface SelectProps {
  label?: string;
  value?: string | string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: [string, string][];
  className?: string;
  placeholder?: string;
  multiple?: boolean
  removeValue?: (val: string) => void;
  setSelected?: (val: string[]) => void;
  selected?: string[];
}
 