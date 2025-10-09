import type { ApiResponse, ListResponse } from "@api/common";
import axiosClient from "../index";
import type { Product } from "@interfaces/pages/product";

const productApi = {
  getAll: (): Promise<ApiResponse<ListResponse<Product>>> =>
    axiosClient.get("/products"),

  getById: (id: string): Promise<Product> =>
    axiosClient.get<Product>(`/products/${id}`).then((res) => {
      return res.data;
    }),

  search: (keyword: string): Promise<Product[]> =>
    axiosClient
      .get<{ data: Product[] }>("/products/search", {
        params: { q: keyword },
      })
      .then((res) => res.data as unknown as Product[]),

  getByCollection: (collectionName: string): Promise<Product[]> =>
    axiosClient
      .get<{ data: Product[] }>("/products/by-collection", {
        params: { name: collectionName },
      })
      .then((res) => res.data as unknown as Product[]),
};

export default productApi;
