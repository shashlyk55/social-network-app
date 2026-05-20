"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Image as ImageIcon, X, Plus, Send } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMe } from "@/hooks/profile/use-me";
import { useUpdatePost } from "@/hooks/post/use-update-post";
import { useUploadAsset } from "@/hooks/asset/use-upload-asset";
import { cn } from "@/lib/utils/cn";
import {
  CreatePostInput,
  createPostSchema,
  MAX_POST_CONTENT_LENGTH,
} from "@/validation-schemas/create-post-schema";
import { useState, useRef } from "react";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import { PostView } from "@/types/post";

interface EditPostFormProps {
  post: PostView;
  onSuccess?: () => void;
}

interface Preview {
  preview: string;
  id?: number;
  isUploading: boolean;
}

export function EditPostForm({ post, onSuccess }: EditPostFormProps) {
  const { data: me } = useMe();
  const { mutate: updatePost, isPending } = useUpdatePost();
  const { mutateAsync: uploadAsset } = useUploadAsset();

  // Инициализируем аттачменты уже существующими картинками из поста
  const [attachments, setAttachments] = useState<Preview[]>(() =>
    post.postAssets.map((pa) => ({
      id: pa.asset.id,
      preview: pa.asset.downloadUrl,
      isUploading: false,
    }))
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: post.content,
      assetIds: post.postAssets.map((pa) => pa.asset.id),
    },
  });

  const contentValue = watch("content") || "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      const preview = URL.createObjectURL(file);
      const newAttachment = { preview, isUploading: true };

      setAttachments((prev) => [...prev, newAttachment]);

      try {
        const uploadedAsset = await uploadAsset({ file });
        setAttachments((prev) =>
          prev.map((a) =>
            a.preview === preview
              ? { ...a, id: uploadedAsset.id, isUploading: false }
              : a
          )
        );

        const currentIds = watch("assetIds") || [];
        setValue("assetIds", [...currentIds, uploadedAsset.id]);
      } catch (error) {
        setAttachments((prev) => prev.filter((a) => a.preview !== preview));
      }
    }
  };

  const removeAttachment = (index: number, assetId?: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    if (assetId) {
      const currentIds = watch("assetIds") || [];
      setValue(
        "assetIds",
        currentIds.filter((id) => id !== assetId)
      );
    }
  };

  const onSubmit = (data: CreatePostInput) => {
    updatePost(
      { data: data, postId: post.id },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const initialAssetIds = post.postAssets
    .map((pa) => pa.asset.id)
    .sort()
    .join(",");
  const currentAssetIds = watch("assetIds")?.sort().join(",");
  const isAssetsChanged = initialAssetIds !== currentAssetIds;

  const hasChanges = isDirty || isAssetsChanged;

  const hasText = contentValue.trim().length > 0;
  const isUploadingAny = attachments.some((a) => a.isUploading);
  const canSubmit =
    hasText && !isUploadingAny && !isPending && hasChanges && isValid;

  return (
    <div className="bg-[#111] rounded-3xl p-2 border border-[#222]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 p-4">
          {me && (
            <UserAvatar
              src={me?.avatarUrl}
              displayName={me?.displayName}
              className="w-12 h-12"
            />
          )}
          <TextareaAutosize
            {...register("content")}
            placeholder="Whats up?"
            className={cn(
              "w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-slate-600 resize-none py-2 min-h-[120px]",
              errors.content && "text-red-400"
            )}
            maxRows={15}
          />
        </div>

        {attachments.length > 0 && (
          <div className="grid grid-cols-3 gap-3 px-6 mb-4">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden border border-[#222] group"
              >
                <Image
                  src={file.preview}
                  unoptimized
                  alt="Attachment"
                  fill
                  className="object-cover"
                />
                {file.isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(index, file.id)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {attachments.length < 10 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-[#222] flex flex-col items-center justify-center text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all gap-2 bg-[#1a1a1a]/50"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-medium">Add</span>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between p-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-500 hover:bg-[#1a1a1a] rounded-xl transition-all group:"
            >
              <ImageIcon className="w-6 h-6 group-hover:text-blue-500" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={cn(
                "text-[10px] font-bold",
                contentValue.length > MAX_POST_CONTENT_LENGTH * 0.9
                  ? "text-amber-500"
                  : "text-slate-600"
              )}
            >
              {contentValue.length} / {MAX_POST_CONTENT_LENGTH}
            </span>
            <button
              type="submit"
              disabled={!canSubmit}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>{isPending ? "Publishing..." : "Publish"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
