export interface WishlistItem {
  id: string;
  productId: string;
  added_date: string;
  product: {
    id: string;
    name: string;
    productGallery: string[];
    color?: string;
    size?: string;
    price: number;
    slug: string;
  };
}

export interface AddToWishlistPayload {
  productId: string;
}

export interface RemoveFromWishlistPayload {
  productId: string;
}
