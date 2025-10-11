export interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartForm {
  color: string;
  size: string;
  quantity: number;
  category?: string;
  price: number;
}

interface CartItem {
  id: string;
  color: string;
  size: string;
  quantity: number;
  category?: string;
  price: number;
  product: {
    id: string;
    name: string;
    productGallery: string[];
    price: number;
    slug: string;
  };
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  category?: string;
  price: number;
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
