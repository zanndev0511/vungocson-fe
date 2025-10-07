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