export interface Order {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingfee: number;
  subtotal: number;
  items: ItemsOrder[];  
}

export interface ItemsOrder {
  id?: string
  size: string;
  quantity: number;
  color: string;
  price: number;
  product: ProductItems;
}

export interface ProductItems {
  id?: string
  sku: string;
  name: string;
  size: string;
  quantity: number;
  slug: string;
  color: string;
  price: number;
  productGallery: string[];
}
