export interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: string | null;
  status: "active" | "inactive";
  updatedAt: string;
  createdAt: string;
}

export interface CategoriesProps {
    setIsAddCategory: (e: boolean) => void;
}

export interface CategoryForm {
  name: string;
  slug: string;
  parent: string | null;
  status: "active" | "inactive";
};
export interface AddCategoryProps {
  setIsAddCategory: (value: boolean) => void;
} 