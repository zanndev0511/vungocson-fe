export interface SortButtonProps {
  title: string;
  options: string[];
  selectedIndexes?: number[];
  onChange?: (selectedIndexes: number[]) => void;
  className?: string;
  type?: "checkbox" | "choice"
}