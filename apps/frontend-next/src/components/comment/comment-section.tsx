"use client";

import { CommentInput } from "./comment-input";
import { CommentList } from "./comment-list";
import { MessageCircle } from "lucide-react";

interface CommentsSectionProps {
  postId: number;
  commentsCount?: number; // Можно передать из поста для заголовка
}

export function CommentsSection({
  postId,
  commentsCount,
}: CommentsSectionProps) {
  return (
    <section className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Заголовок секции */}
      <div className="flex items-center gap-3 px-1">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <MessageCircle className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Comments
          {commentsCount !== undefined && (
            <span className="ml-2 text-slate-500 font-medium">
              ({commentsCount})
            </span>
          )}
        </h3>
      </div>

      {/* Форма создания (Корневая) */}
      <div className="relative">
        <CommentInput postId={postId} />
        {/* Декоративная линия, соединяющая инпут со списком */}
        <div className="absolute -bottom-8 left-9 w-px h-8 bg-gradient-to-b from-[#222] to-transparent" />
      </div>

      {/* Список комментариев */}
      <div className="min-h-[100px]">
        <CommentList postId={postId} />
      </div>
    </section>
  );
}
