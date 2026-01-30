"use client";

import { PostItem } from "./post-item";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostById } from "@/hooks/post/use-post-by-id";

export function PostDetailView({ postId }: { postId: number }) {
  const router = useRouter();

  const { data: post, isLoading, isError } = usePostById(postId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-400">Пост не найден</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-500 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка: Сам пост (используем существующий PostItem или его расширенную версию) */}
        <div className="lg:col-span-2">
          <PostItem post={post} isDetailPage />
          {/* TODO: add comment list and comment input */}
        </div>
      </div>
    </div>
  );
}
