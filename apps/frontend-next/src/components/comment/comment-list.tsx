"use client";

import { useComments } from "@/hooks/comment/use-comments";
import { CommentItem } from "./comment-item";
import { Loader2 } from "lucide-react";

interface CommentListProps {
  postId: number;
  parentCommentId?: number | null;
}

export function CommentList({
  postId,
  parentCommentId = null,
}: CommentListProps) {
  const { data, isLoading, isError } = useComments({
    postId,
    parentCommentId,
    order: "DESC",
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-sm text-red-500">
        Failed to load comments
      </div>
    );
  }

  const comments = data?.data || [];

  if (comments.length === 0 && parentCommentId === null) {
    return (
      <div className="text-center py-10 border border-dashed border-[#222] rounded-3xl">
        <p className="text-slate-500 text-sm">No comments yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
