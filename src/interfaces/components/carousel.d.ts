export interface ProductCarousel {
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
export interface CarouselProps {
  itemProducts: ProductCarousel[];
  className?: string;
}
export {};