import { UserAvatar } from "@/components/ui/user-avatar";
import {
  MoreVertical,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Archive,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { PostView } from "@/types/post";
import Image from "next/image";
import { useToggleArchive } from "@/hooks/post/use-toggle-archive";
import { useMe } from "@/hooks/profile/use-me";
import { useState } from "react";
import { useTogglePostLike } from "@/hooks/post/use-toggle-post-like";
import { motion } from "framer-motion";
import { useDeletePost } from "@/hooks/post/use-delete-post";

interface PostItemProps {
  post: PostView;
  isArchivePage?: boolean;
}

export function PostItem({ post, isArchivePage = false }: PostItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: me } = useMe();
  const { mutate: toggleArchive, isPending: isArchiving } = useToggleArchive();
  const { mutate: toggleLike } = useTogglePostLike(post.id);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const isOwner = me?.id === post.profile.id;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id);
      setIsMenuOpen(false);
    }
  };

  const MAX_LINES = 4;
  const TEXT_THRESHOLD = 300;
  const shouldShowExpand =
    post.content !== undefined
      ? post.content.length > TEXT_THRESHOLD ||
        post.content.split("\n").length > MAX_LINES
      : false;

  const sortedAssets = [...post.postAssets].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden transition-all hover:border-[#333]">
      <div className="p-5 md:p-6">
        {/* Header: Автор и меню */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <UserAvatar
              src={post.profile.avatarUrl}
              displayName={post.profile.displayName}
              className="h-10 w-10"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white">
                  {post.profile.displayName}
                </span>
                <span className="text-slate-500 text-sm">•</span>
                <span className="text-slate-500 text-sm">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </span>
              </div>
              <p className="text-slate-500 text-sm">@{post.profile.username}</p>
            </div>
          </div>

          {/* Меню управления */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-[#1a1a1a] rounded-full text-slate-500 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-slate-500" />
              </button>

              {isMenuOpen && (
                <>
                  {/* Оверлей для закрытия меню по клику вне */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl z-20 py-2 overflow-hidden">
                    {/* Кнопка архивации */}
                    <button
                      disabled={isArchiving}
                      onClick={() => {
                        toggleArchive(post.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-[#252525] transition-colors flex items-center gap-3 text-slate-300"
                    >
                      <Archive className="w-4 h-4" />
                      {isArchivePage ? "Unarchive Post" : "Archive Post"}
                    </button>

                    {/* Кнопка удаления */}
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content: Текст */}
        <div className="space-y-4">
          {post.content && (
            <div className="px-6 py-2">
              <div
                className={cn(
                  "text-white leading-relaxed wrap-break-word whitespace-pre-wrap transition-all duration-300",
                  !isExpanded && "line-clamp-4"
                )}
                style={{
                  display: !isExpanded ? "-webkit-box" : "block",
                  WebkitLineClamp: !isExpanded ? MAX_LINES : "none",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.content}
              </div>

              {shouldShowExpand && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {isExpanded ? "Show less" : "Show more..."}
                </button>
              )}
            </div>
          )}

          {/* Assets: Сетка изображений */}
          {post.postAssets && post.postAssets.length > 0 && (
            <div
              className={cn(
                "grid gap-2 rounded-2xl overflow-hidden border border-[#222]",
                post.postAssets.length === 1 ? "grid-cols-1" : "grid-cols-2"
              )}
            >
              {sortedAssets.map((pa) => (
                <div
                  key={pa.id}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-[#222]"
                >
                  <Image
                    key={pa.id}
                    src={pa.asset.downloadUrl}
                    unoptimized
                    alt="Post content"
                    fill
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Взаимодействия */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#1a1a1a]">
          <button
            onClick={() => toggleLike()}
            className={cn(
              "flex items-center gap-2 group transition-colors outline-none",
              post.isLiked
                ? "text-red-500"
                : "text-slate-500 hover:text-red-500"
            )}
          >
            <motion.div
              whileTap={{ scale: 1.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  post.isLiked && "fill-current text-red-500"
                )}
              />
            </motion.div>

            <span className="text-sm font-bold tabular-nums">
              {post.likesCount}
            </span>
          </button>

          <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors group">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </button>

          <button className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors ml-auto">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
