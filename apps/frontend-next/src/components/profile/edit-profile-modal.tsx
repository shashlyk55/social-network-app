"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import {
  User,
  AtSign,
  Globe,
  Lock,
  AlertCircle,
  Calendar,
  X,
} from "lucide-react";
import {
  EditProfileFormValues,
  editProfileSchema,
} from "@/validation-schemas/edit-profile-schema";
import { useModalStore } from "@/store/use-modal-store";
import { MyProfile, UpdateProfileInput } from "@/types/profile";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";
import { useRef } from "react";
import { UserAvatar } from "../ui/user-avatar";
import { useUploadAsset } from "@/hooks/asset/use-upload-asset";

export function EditProfileModal({ profile }: { profile: MyProfile }) {
  const { isEditProfileOpen, onClose } = useModalStore();
  const { mutate: update, isPending } = useUpdateProfile();
  const assetInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: profile.displayName,
      username: profile.username,
      bio: profile.bio || "",
      avatarUrl: profile.avatarUrl || "",
      birthday: profile.birthday
        ? new Date(profile.birthday).toISOString().split("T")[0]
        : "",
      isPublic: profile.isPublic,
    },
  });

  const { mutate: upload, isPending: isUploading } = useUploadAsset();
  const currentAvatar = watch("avatarUrl");

  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.loading("Загрузка файла...", { id: "upload-file" });
      upload(file, {
        onSuccess: (data) => {
          setValue("avatarUrl", data.url, { shouldDirty: true });
        },
      });
    }
  };

  const removeAvatar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Чтобы не сработал клик по родителю (открытие выбора файла)
    setValue("avatarUrl", null, { shouldDirty: true });

    if (assetInputRef.current) assetInputRef.current.value = "";
  };

  const bioCounterValue = watch("bio") || "";
  const isPublicValue = watch("isPublic");

  if (!isEditProfileOpen) return null;

  const onSubmit = (data: EditProfileFormValues) => {
    const payload: UpdateProfileInput = {
      displayName: data.displayName,
      username: data.username,
      isPublic: data.isPublic,
      bio: data.bio?.trim() || null,
      avatarUrl: data.avatarUrl?.trim() || null,
      birthday: data.birthday ? new Date(data.birthday).toISOString() : null,
    };

    update(payload, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Редактирование профиля
            </h2>
            <p className="text-xs text-slate-500">
              Настройте свои личные данные
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" /> Имя
              </label>
              <input
                {...register("displayName")}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
                  errors.displayName
                    ? "border-red-500 focus:ring-red-200"
                    : "focus:ring-emerald-500"
                }`}
              />
              {errors.displayName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{" "}
                  {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <AtSign className="w-4 h-4" /> Никнейм
              </label>
              <input
                {...register("username")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* Визуализация загрузки аватара */}
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={() => !isUploading && assetInputRef.current?.click()}
              className={cn(
                "relative cursor-pointer rounded-full transition-all border-4",
                isUploading
                  ? "opacity-50 border-emerald-400 animate-pulse"
                  : "border-white shadow-lg hover:border-emerald-100"
              )}
            >
              <UserAvatar
                src={currentAvatar}
                displayName={watch("displayName")}
                className="h-28 w-28"
              />

              {/* Кнопка удаления (появляется если есть фото и нет загрузки) */}
              {currentAvatar && !isUploading && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors z-10"
                  title="Удалить фото"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Overlay с лоадером */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isUploading
                ? "Файл отправляется..."
                : "Нажмите, чтобы изменить фото"}
            </p>
          </div>

          {/* Скрытый инпут для выбора файла */}
          <input
            type="file"
            ref={assetInputRef}
            onChange={handleAssetChange}
            className="hidden"
            accept="image/*"
          />

          {/* Скрытое текстовое поле для URL (на всякий случай, или просто для хранения в RHF) */}
          <input type="hidden" {...register("avatarUrl")} />

          {/* Birthday */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Дата рождения
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              {...register("birthday")}
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                О себе
              </label>
              {/* 2. Отображаем счетчик */}
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  bioCounterValue.length > 180
                    ? "bg-amber-100 text-amber-600"
                    : "bg-slate-100 text-slate-500",
                  bioCounterValue.length >= 200 && "bg-red-100 text-red-600"
                )}
              >
                {bioCounterValue.length} / 200
              </span>
            </div>

            <textarea
              {...register("bio")}
              maxLength={200}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none transition-all",
                errors.bio ? "border-red-500" : "border-slate-200"
              )}
              placeholder="Расскажите немного о себе..."
            />
            {errors.bio && (
              <p className="text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>

          {/* Privacy Toggle (через setValue) */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              isPublicValue
                ? "bg-emerald-50 border-emerald-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {isPublicValue ? (
                <Globe className="text-emerald-600" />
              ) : (
                <Lock className="text-slate-600" />
              )}
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {isPublicValue ? "Публичный профиль" : "Приватный профиль"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValue("isPublic", !isPublicValue)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublicValue ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublicValue ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border rounded-xl"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50"
            >
              {isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
