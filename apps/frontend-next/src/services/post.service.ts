import { apiClient } from "@/lib/api-client";
import { PaginatedData } from "@/types/pagination";
import { CreatePost, FindPostsParams, PostLike, PostView } from "@/types/post";

export const PostService = {
  async findAll(params: FindPostsParams): Promise<PaginatedData<PostView>> {
    const { data } = await apiClient.get<PaginatedData<PostView>>("/posts", {
      params,
    });
    return data;
  },

  async create(createData: CreatePost): Promise<PostView> {
    const { data } = await apiClient.post<PostView>("/posts", createData);
    return data;
  },

  async toggleArchive(postId: number): Promise<void> {
    await apiClient.patch(`/posts/${postId}/archive`);
  },

  async togglePostLike(postId: number): Promise<PostLike> {
    const { data } = await apiClient.post(`/posts/${postId}/like`);
    return data;
  },

  async delete(postId: number): Promise<void> {
    await apiClient.delete(`/posts/${postId}`);
  },
};
