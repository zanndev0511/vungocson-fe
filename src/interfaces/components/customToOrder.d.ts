export interface CustomToOrderProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
  productCategories: string[]
}

export interface CustomSizeOrderForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  socialMedia?: string;
  contactTime?: string;
  measurementUnit: string;
  message?: string;
  customSizeOrder: CustomSizeOrderMeasurements;
}

export interface CustomSizeOrderMeasurements {
  nameProduct: string;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
  armLength: number;
  neckCircumference: number;
}

