import { UserAvatar } from "@/components/ui/user-avatar";
import {
  MoreVertical,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Archive,
  Edit2,
  Link,
  Send,
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
import { useModalStore } from "@/store/use-modal-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ActionMenu } from "../ui/action-menu";

interface PostItemProps {
  post: PostView;
  isArchivePage?: boolean;
  isDetailPage?: boolean;
}

export function PostItem({
  post,
  isArchivePage = false,
  isDetailPage = false,
}: PostItemProps) {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);

  const { data: me } = useMe();
  const { onOpen } = useModalStore();
  const { mutate: toggleArchive, isPending: isArchiving } = useToggleArchive();
  const { mutate: toggleLike } = useTogglePostLike(post.id);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const isOwner = me?.id === post.profile.id;

  const handleNavigate = () => {
    if (isDetailPage) return;
    router.push(`/posts/${post.id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id);
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

  const shareMenuItems = [
    {
      label: "Copy Link",
      icon: Link,
      onClick: async () => {
        const url = `${window.location.origin}/posts/${post.id}`;
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      },
    },
    {
      label: "Send to...",
      icon: Send,
      disabled: true,
    },
  ];

  const actionsMenuItems = [
    {
      label: "Edit",
      icon: Edit2,
      onClick: () => onOpen("editPost", { post }),
    },
    {
      label: isArchivePage ? "Unarchive" : "Archive",
      icon: Archive,
      onClick: () => toggleArchive(post.id),
      disabled: isArchiving,
    },
    {
      label: isDeleting ? "Deleting..." : "Delete",
      icon: Trash2,
      variant: "danger" as const,
      onClick: handleDelete,
      disabled: isDeleting,
    },
  ];

  console.log(post);

  return (
    <div
      onClick={handleNavigate}
      className={cn(
        "bg-[#111] border border-[#222] rounded-3xl overflow-hidden transition-all",
        !isDetailPage && "cursor-pointer hover:border-[#333]"
      )}
    >
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

          {isOwner && (
            <ActionMenu
              trigger={
                <button className="p-2 hover:bg-[#1a1a1a] rounded-full text-slate-500 transition-colors outline-none">
                  <MoreVertical className="w-5 h-5" />
                </button>
              }
              items={actionsMenuItems}
            />
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
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
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            className={cn(
              "flex items-center gap-2 group transition-colors outline-none",
              post.isLiked
                ? "text-red-500"
                : "text-slate-500 hover:text-red-500"
            )}
          >
            <motion.div
              key={post.isLiked ? "liked" : "unliked"}
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

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors group"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </button>

          {!isArchivePage && (
            <ActionMenu
              trigger={
                <button
                  //onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors mr-auto"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              }
              items={shareMenuItems}
            />
          )}
        </div>
      </div>
    </div>
  );
}
