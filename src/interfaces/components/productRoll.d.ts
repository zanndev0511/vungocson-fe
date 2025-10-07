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
export {};