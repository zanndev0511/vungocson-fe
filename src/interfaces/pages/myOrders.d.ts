export interface MyOrdersProps {
  selectedProduct: number;
  setSelectedProduct: (id: number) => void;
}
export interface DateChangeHandlers {
  setValueCalendar: (val: DateValue) => void;
  setStartDate: (val: Date | null) => void;
  setEndDate: (val: Date | null) => void;
}
export {};