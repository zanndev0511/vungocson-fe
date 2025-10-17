export interface FeaturedCollectionsProps {
  runway: RunwayFeatured[];
  className?: string;
  redirectUrl?: string;
}
export interface RunwayFeatured {
  id: string;
  name: string;
  banners: string[];
  description: string;
  video: string;
  collection?: CollectionRunway;
  status: "active" | "inactive";
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
