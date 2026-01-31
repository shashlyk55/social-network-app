"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostItem } from "./post-item";
import { Loader2, ChevronLeft, MessageCircle, Heart } from "lucide-react";
import { usePostById } from "@/hooks/post/use-post-by-id";
import { CommentsSection } from "../comment/comment-section";
import { cn } from "@/lib/utils/cn";

type TabType = "comments" | "likes";

export function PostDetailView({ postId }: { postId: number }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("comments");

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
        <h2 className="text-2xl font-bold text-slate-400">Post not found</h2>
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
    <div className="max-w-[1400px] mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 sticky top-6">
          <PostItem post={post} isDetailPage />
        </div>

        <div className="lg:col-span-5 bg-[#0d0d0d] rounded-3xl border border-[#1a1a1a] overflow-hidden min-h-[600px] flex flex-col">
          <div className="flex border-b border-[#1a1a1a]">
            <button
              onClick={() => setActiveTab("comments")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all",
                activeTab === "comments"
                  ? "text-blue-500 bg-blue-500/5 border-b-2 border-blue-500"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <MessageCircle className="w-5 h-5" />
              Comments ({post.commentsCount})
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-all",
                activeTab === "likes"
                  ? "text-red-500 bg-red-500/5 border-b-2 border-red-500"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Heart className="w-5 h-5" />
              Likes ({post.likesCount})
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
            {activeTab === "comments" ? (
              <CommentsSection
                postId={postId}
                commentsCount={post.commentsCount}
              />
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-center py-20 text-slate-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Likes list is empty</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
