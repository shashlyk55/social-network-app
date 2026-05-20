"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMe } from "@/hooks/profile/use-me";
import { useCreateComment } from "@/hooks/comment/use-create-comment";
import { useUpdateComment } from "@/hooks/comment/use-update-comment"; //
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  CommentFormValues,
  commentSchema,
} from "@/validation-schemas/create-comment-schema";
import TextareaAutosize from "react-textarea-autosize";

interface CommentInputProps {
  postId: number;
  commentId?: number;
  initialValue?: string;
  parentCommentId?: number | null;
  placeholder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export function CommentInput({
  postId,
  commentId,
  initialValue = "",
  parentCommentId = null,
  placeholder = "Write a comment...",
  onSuccess,
  onCancel,
  autoFocus = false,
}: CommentInputProps) {
  const { data: me } = useMe();
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();

  const isEditing = !!commentId;
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: initialValue },
  });

  const onSubmit = (values: CommentFormValues) => {
    if (isEditing) {
      updateComment(
        { commentId, updatedData: values }, //
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createComment(
        { content: values.content, postId, parentCommentId }, //
        {
          onSuccess: () => {
            reset();
            onSuccess?.();
          },
        }
      );
    }
  };

  return (
    <div className="flex gap-3">
      {/* Аватар скрываем при редактировании или ответах для компактности */}
      {me && !parentCommentId && !isEditing && (
        <UserAvatar
          src={me.avatarUrl}
          displayName={me.displayName}
          className="w-8 h-8 shrink-0 ring-2 ring-[#1a1a1a] ring-offset-2 ring-offset-[#0d0d0d]"
        />
      )}

      <div className="flex-1 space-y-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <TextareaAutosize
            {...register("content")}
            autoFocus={autoFocus}
            placeholder={placeholder}
            className={cn(
              "w-full bg-[#1a1a1a] border border-[#333] rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all resize-none",
              errors.content && "border-red-500/50"
            )}
          />

          <div className="flex justify-end gap-2 animate-in fade-in slide-in-from-top-1">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {isEditing ? "Save" : parentCommentId ? "Reply" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
