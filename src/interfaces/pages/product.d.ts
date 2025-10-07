export interface Product {
  id?: string
  sku: string;
  name: string;
  description: string;
  categories: string[];
  collection: string;
  size: string;
  slug: string;
  color: string[];
  price: number;
  status: "active" | "out_of_stock" | "hidden";
  tag: string[];
  productGallery: string[];
  items?: ProductItemForm[];
  updatedAt?: string;
  createdAt?: string;
}
export interface ProductForm {
  sku: string;
  name: string;
  description: string;
  categories: string[];
  collection: string;
  slug: string;
  size: string;
  color: string[];
  price: number;
  status: "active" | "out_of_stock" | "hidden";
  tag: string[];
  productGallery: File[];
  items?: ProductItemForm[];
}

export interface ProductItemForm {
  name: string;
  price: number;
}

export interface CategoriesProduct {
  id?: string;
  name: string;
}