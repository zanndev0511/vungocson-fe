export interface ProductRollProps {
  runwayFeature: RunwayProductRoll 
  className?: string;
}

export interface RunwayProductRoll {
  id: string;
  name: string;
  banners: string[];
  description: string;
  video: string;
  slug: string;
  celebs: CelebRunway[];
  products: ProductRunway[];
  collectionId: string;
  collection?: CollectionRunway;
  status: "active" | "inactive";
  galleries: GalleryRunway[]
  isFeatured: boolean;
  created: string;
  updated: string;
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