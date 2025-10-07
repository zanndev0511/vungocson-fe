export interface NewsProps {
  listNews: NewsData[]
}
export interface NewsData {
  id?: string;
  title: string;
  slug: string;
  poster: string;
  content: string;
  description: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}
export interface NewsForm {
  title: string;
  slug: string;
  description: string;
  poster: string | File;
  content: string;
  status: "active" | "inactive";
}
