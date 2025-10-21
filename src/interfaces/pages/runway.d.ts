export interface Runway {
  id: string;
  name: string;
  banners: string[];
  description: string;
  video: string;
  slug: string;
  youtubeUrl: string;
  celebs: CelebRunway[];
  products: ProductRunway[];
  collectionId: string;
  collection?: CollectionRunway;
  status: "active" | "inactive";
  galleries: GalleryRunway[];
  isFeatured: boolean;
  created: string;
  updated: string;
}

export interface RunwaysProps {
  setIsAddRunway: (value: boolean) => void;
}

export interface RunwayForm {
  id?: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  banners: (string | File)[];
  video?: string | File;
  isFeatured: boolean;
}
export interface CelebRunway {
  id?: string;
  name: string;
  image: string;
  profession: string;
  collectionNames?: string;
  collectionIds?: string[];
  collections?: { id: string; name: string }[];
  outfit: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRunway {
  id?: string;
  sku: string;
  name: string;
  description: string;
  categories: string[];
  collection: string;
  slug: string;
  color?: string[];
  price: number;
  status: "active" | "out_of_stock" | "hidden";
  tag: string[];
  productGallery: string[];
  items?: ProductItemForm[];
  updatedAt?: string;
  createdAt?: string;
}

export interface CollectionRunway {
  id?: string;
  name: string;
  slug: string;
  description: string;
  products: ProductRunway[];
  banner: string[];
  status: "active" | "inactive";
  sortOrder: number;
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryRunway {
  id?: string;
  image: string | null;
  runway?: RunwayGallery;
  product?: ProductGallery;
  productId?: string;
  runwayId?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductGallery {
  id?: string;
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
