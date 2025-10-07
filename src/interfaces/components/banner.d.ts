export interface BannerProps {
  images: string[];
}
export interface Banners {
  id?: string;
  imageUrl: string;
  status: "active" | "inactive";
  order: number;
  updatedAt?: string;
  createdAt?: string;
}
export interface BannersForm {
  imageUrl: File | string;
  status: "active" | "inactive";
  order: number;
}
