export interface CustomToOrderProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productPrice: number;
  productColor: string;
  productCategories: string[]
}