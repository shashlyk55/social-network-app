import { apiClient } from "@/lib/api-client";
import { FindPaginationParams, PaginatedData } from "@/types/pagination";
import {
  CreatePost,
  FindPostsParams,
  PostLike,
  PostView,
  UpdatePost,
} from "@/types/post";

export const PostService = {
  async findAll(
    params: FindPostsParams & FindPaginationParams
  ): Promise<PaginatedData<PostView>> {
    const { data } = await apiClient.get<PaginatedData<PostView>>("/posts", {
      params,
    });
    return data;
  },

  async findOne(postId: number): Promise<PostView> {
    const { data } = await apiClient.get<PostView>(`/posts/${postId}`);
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

  async update(postId: number, updateData: UpdatePost): Promise<PostView> {
    const { data } = await apiClient.patch<PostView>(
      `/posts/${postId}`,
      updateData
    );
    return data;
  },

  async getFeed(
    params: FindPaginationParams
  ): Promise<PaginatedData<PostView>> {
    const { data } = await apiClient.get<PaginatedData<PostView>>(
      "/posts/feed",
      {
        params,
      }
    );
    return data;
  },
};
