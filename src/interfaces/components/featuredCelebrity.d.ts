export interface FeaturedCelebrityProps {
  data: FeaturedCelebrity[];
}

export interface FeaturedCelebrity {
  id: string;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedCelebrityForm {
  image: File | string;
  status: "active" | "inactive";
}
