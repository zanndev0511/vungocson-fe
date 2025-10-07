export interface Collection {
  id?: string;
  name: string;
  slug: string;
  description: string;
  banner: string[];
  status: "active" | "inactive";
  products: ProductCollection[]
}

export interface ProductCollection {
  id?: string
  sku: string;
  name: string;
  slug: string;
  status: "active" | "out_of_stock" | "hidden";
  productGallery: string[];
}