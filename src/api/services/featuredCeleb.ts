import type { ApiResponse, ListResponse } from "@api/common";
import type { FeaturedCelebrity } from "@interfaces/components/featuredCelebrity";
import axiosClient from "../index";


const featuredCelebrityApi = {
  getAll: (): Promise<ApiResponse<ListResponse<FeaturedCelebrity>>> =>
    axiosClient.get("/featured-celeb"),
};

export default featuredCelebrityApi;
