"use client";

import { useState } from "react";
import { CommentView } from "@/types/comment";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  Reply as ReplyIcon,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CommentInput } from "./comment-input";
import { CommentList } from "./comment-list";
import { useMe } from "@/hooks/profile/use-me";
import { useDeleteComment } from "@/hooks/comment/use-delete-comment";
import { useToggleCommentLike } from "@/hooks/comment/use-toggle-comment-like";
import { CommentContextMenu } from "../ui/context-menu";
import { ActionMenu } from "../ui/action-menu";

interface CommentItemProps {
  comment: CommentView;
}

export function CommentItem({ comment }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { data: me } = useMe();
  const { mutate: deleteComment } = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);

  const isMyComment =
    me?.id === comment.profile.id || me?.id === comment.profile.id;

  const handleDelete = () => {
    if (window.confirm("Удалить этот комментарий?")) {
      deleteComment({
        commentId: comment.id,
        postId: comment.postId,
        parentCommentId: comment.parentCommentId,
      });
    }
  };

  const canReply = comment.parentCommentId === null;

  const { mutate: toggleLike } = useToggleCommentLike();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleLike(comment.id);
  };

  // const menuItems = [
  //   {
  //     label: "Reply",
  //     icon: ReplyIcon,
  //     onclick: () => setIsReplying(!isReplying),
  //   },
  //   {
  //     label: "Edit",
  //     icon: Pencil,
  //     onClick: () => setIsEditing(true),
  //   },
  //   {
  //     label: "Delete",
  //     icon: Trash2,
  //     variant: "danger" as const,
  //     onClick: handleDelete,
  //   },
  // ];

  const menuItems = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => setIsEditing(true),
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "danger" as const,
      onClick: handleDelete,
    },
  ];

  return (
    <div className="group animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex gap-3">
        {/* Аватар с индикатором линии (если есть ответы) */}
        <div className="flex flex-col items-center gap-1">
          <UserAvatar
            src={comment.profile.avatarUrl}
            displayName={comment.profile.displayName}
            className="w-8 h-8 shrink-0 ring-2 ring-[#1a1a1a] ring-offset-2 ring-offset-[#0d0d0d]"
          />
          {showReplies && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full" />
          )}
        </div>

        <div className="flex-1 space-y-2 min-w-0">
          {/* Инфо-панель сверху */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-[13px] hover:text-blue-400 cursor-pointer transition-colors">
                {comment.profile.displayName}
              </span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span className="text-[10px] text-slate-500 font-medium">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Кнопка удаления только для своих комментариев */}
            {isMyComment && (
              <ActionMenu
                items={menuItems}
                trigger={
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-600 hover:text-white">
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                }
              />
            )}
          </div>

          {isEditing ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <CommentInput
                postId={comment.postId}
                commentId={comment.id}
                initialValue={comment.content}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
                autoFocus
              />
            </div>
          ) : (
            <CommentContextMenu items={menuItems}>
              <div className="relative group/bubble w-fit max-w-full">
                <div className="p-3 rounded-2xl rounded-tl-none border bg-[#161616] border-[#222] text-[14px] text-slate-300 break-words whitespace-pre-wrap">
                  {comment.content}
                </div>
              </div>
            </CommentContextMenu>
          )}

          {/* Панель действий */}
          <div className="flex items-center gap-5 px-0.5">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 transition-colors group/like",
                comment.isLiked
                  ? "text-red-500"
                  : "text-slate-500 hover:text-red-500"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  comment.isLiked
                    ? "bg-red-500/10"
                    : "group-hover/like:bg-red-500/10"
                )}
              >
                <Heart
                  className={cn(
                    "w-3.5 h-3.5 transition-transform active:scale-125",
                    comment.isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-current"
                  )}
                />
              </div>
              <span className="text-xs font-medium">{comment.likesCount}</span>
            </button>

            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className={cn(
                  "flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-all",
                  isReplying && "text-blue-500"
                )}
              >
                <div className="p-1.5 rounded-full hover:bg-blue-500/10">
                  <ReplyIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-tight">
                  Reply
                </span>
              </button>
            )}

            {canReply && comment.repliesCount > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1.5 text-blue-500/80 hover:text-blue-400 transition-colors group/replies"
              >
                <span className="text-xs font-bold uppercase tracking-tight">
                  {showReplies ? "Hide" : `Replies (${comment.repliesCount})`}
                </span>
                {showReplies ? (
                  <ChevronUp className="w-3.5 h-3.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                )}
              </button>
            )}
          </div>

          {/* Плавная форма ответа */}
          {canReply && isReplying && (
            <div className="pt-2 animate-in zoom-in-95 duration-200">
              <CommentInput
                postId={comment.postId}
                parentCommentId={comment.id}
                placeholder={`Ваш ответ для ${comment.profile.displayName}...`}
                autoFocus
                onSuccess={() => {
                  setIsReplying(false);
                  setShowReplies(true);
                }}
                onCancel={() => {
                  setIsReplying(false);
                }}
              />
            </div>
          )}

          {/* Вложенные ветки с улучшенной линией */}
          {showReplies && (
            <div className="mt-4 pl-2 border-l border-blue-500/10 space-y-4">
              <CommentList
                postId={comment.postId}
                parentCommentId={comment.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
