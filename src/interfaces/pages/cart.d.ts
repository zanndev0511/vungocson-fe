export interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartForm {
  color: string;
  size: string;
  quantity: number;
}

interface CartItem {
  id: string;
  color: string;
  size: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    productGallery: string[];
    price: number;
  };
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  customSize?: CustomSizeInfo;
}

export interface CustomSizeInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  preferredDeliveryDate: string;
  measurements: Record<string, number>;
}

export interface RemoveFromCartPayload {
  cartItemId: number;
}

export interface EditCartPayload {
  cartItemId: number;
  quantity: number;
}
