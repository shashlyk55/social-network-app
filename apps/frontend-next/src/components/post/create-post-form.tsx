"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, Image as ImageIcon, X, Plus } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMe } from "@/hooks/profile/use-me";
import { useCreatePost } from "@/hooks/post/use-create-post";
import { useUploadAsset } from "@/hooks/asset/use-upload-asset";
import { cn } from "@/lib/utils/cn";
import {
  CreatePostInput,
  createPostSchema,
  MAX_POST_CONTENT_LENGTH,
} from "@/validation-schemas/create-post-schema";
import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import TextareaAutosize from "react-textarea-autosize";

interface FileWithPreview {
  file: File;
  preview: string;
  id?: number;
  isUploading: boolean;
}

export function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: me } = useMe();
  const { mutate: createPost, isPending } = useCreatePost();
  const { mutateAsync: uploadAsset } = useUploadAsset();

  const [attachments, setAttachments] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: "", assetIds: [] },
    mode: "onChange",
  });

  // Хендлер выбора файлов
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const startIndex = attachments.length;

    // Ограничение, например, до 10 файлов (как в DTO)
    const newFiles = files.slice(0, 10 - startIndex).map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      orderIndex: startIndex + index,
    }));

    setAttachments((prev) => [...prev, ...newFiles]);

    // Загружаем каждый файл на бэкенд
    for (const item of newFiles) {
      try {
        const uploadedAsset = await uploadAsset({
          file: item.file,
          orderIndex: item.orderIndex,
        });

        setAttachments((prev) =>
          prev.map((a) =>
            a.file === item.file
              ? { ...a, id: uploadedAsset.id, isUploading: false }
              : a
          )
        );
      } catch (error) {
        toast.error("Error uploading file", { id: "upload-post-asset" });
        setAttachments((prev) => prev.filter((a) => a.file !== item.file));
      }
    }
  };

  const removeAttachment = (index: number) => {
    const item = attachments[index];
    URL.revokeObjectURL(item.preview); // Чистим память
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CreatePostInput) => {
    // Собираем все загруженные ID
    const assetIds = attachments
      .map((a) => a.id)
      .filter((id): id is number => !!id);

    createPost(
      { ...data, assetIds },
      {
        onSuccess: () => {
          reset();
          setAttachments([]);
          onSuccess?.();
        },
      }
    );
  };

  const { ref: contentRef, ...contentProps } = register("content");

  const contentValue = watch("content") || "";

  // Блокируем отправку, пока идут загрузки
  const isUploadingAny = attachments.some((a) => a.isUploading);
  const canSubmit = contentValue.trim().length > 0 && !isUploadingAny;

  return (
    <div className="bg-[#111] rounded-3xl p-2 border border-[#222]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4 p-4">
          {me && (
            <UserAvatar
              src={me?.avatarUrl}
              displayName={me?.displayName}
              className="w-12 h-12"
            />
          )}
          <TextareaAutosize
            {...contentProps}
            ref={(e) => {
              contentRef(e); // Привязываем ref для react-hook-form
            }}
            className={cn(
              "w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-slate-600 resize-none py-2 min-h-[120px]",
              errors.content && "text-red-400"
            )}
            placeholder="Что нового?"
            maxRows={15} // Ограничим максимальную высоту, чтобы форма не ушла в бесконечность
          />
        </div>

        {/* Сетка превью ассетов */}
        {attachments.length > 0 && (
          <div className="grid grid-cols-3 gap-3 px-6 mb-4">
            {attachments.map((item, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden border border-[#222] group"
              >
                <Image
                  src={item.preview}
                  alt="preview"
                  fill
                  className="object-cover"
                />

                {item.isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-white" />
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
                <span className="text-xs font-medium">Добавить</span>
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between items-center p-4 border-t border-[#1a1a1a]">
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
              className="p-2.5 text-slate-500 hover:bg-[#1a1a1a] rounded-xl transition-all group"
            >
              <ImageIcon className="w-6 h-6 group-hover:text-blue-500" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={cn(
                "text-[10px] font-bold",
                contentValue.length > MAX_POST_CONTENT_LENGTH * 0.1
                  ? "text-amber-500"
                  : "text-slate-600"
              )}
            >
              {contentValue.length} / {MAX_POST_CONTENT_LENGTH}
            </span>

            <button
              type="submit"
              disabled={!isValid || isPending || !canSubmit}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>{isPending ? "Публикация..." : "Опубликовать"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
