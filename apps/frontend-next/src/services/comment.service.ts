import { apiClient } from "@/lib/api-client";
import {
  CommentLike,
  CommentView,
  CreateComment,
  FindCommentsParams,
  UpdateComment,
} from "@/types/comment";
import { PaginatedData } from "@/types/pagination";

export const CommentService = {
  async findAll(
    params: FindCommentsParams
  ): Promise<PaginatedData<CommentView>> {
    const { data } = await apiClient.get<PaginatedData<CommentView>>(
      "/comments",
      {
        params,
      }
    );
    return data;
  },

  async create(createData: CreateComment): Promise<CommentView> {
    const { data } = await apiClient.post<CommentView>("/comments", createData);
    return data;
  },

  async delete(commentId: number): Promise<void> {
    await apiClient.delete<void>(`/comments/${commentId}`);
  },

  async update(
    commentId: number,
    updatedData: UpdateComment
  ): Promise<CommentView> {
    const { data } = await apiClient.put<CommentView>(
      `/comments/${commentId}`,
      updatedData
    );
    return data;
  },

  async toggleCommentLike(commentId: number): Promise<CommentLike> {
    const { data } = await apiClient.post(`/comments/${commentId}/like`);
    return data;
  },
};
