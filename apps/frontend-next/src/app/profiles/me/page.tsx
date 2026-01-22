"use client";

import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMe } from "@/hooks/profile/use-me";
import { useModalStore } from "@/store/use-modal-store";
import { Calendar, Shield, Users, FileText, Settings2 } from "lucide-react";

export default function MyProfilePage() {
  const { data: profile, isLoading } = useMe();
  const { onOpen } = useModalStore();

  if (isLoading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!profile)
    return <div className="p-8 text-center">Вы не авторизованы</div>;

  const formatDate = (date?: Date | null) => {
    if (!date) return "Не указана";
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Шапка профиля */}
      <div className="flex flex-col items-center sm:flex-row sm:items-end gap-6 mb-8">
        <UserAvatar
          src={profile.avatarUrl}
          displayName={profile.displayName}
          className="h-32 w-32 text-4xl shadow-lg border-4 border-white"
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900">
            {profile.displayName}
          </h1>
          <p className="text-slate-500 text-lg">@{profile.username}</p>
          <button
            onClick={onOpen}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Settings2 className="w-4 h-4" />
            Редактировать
          </button>
        </div>
      </div>

      {/* Сетка с данными */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Основная информация */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
            <Shield className="w-4 h-4 text-blue-500" /> Личные данные
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> День рождения
              </span>
              <span className="text-slate-900">
                {formatDate(profile.birthday)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Тип аккаунта
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  profile.isPublic
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {profile.isPublic ? "Публичный" : "Приватный"}
              </span>
            </div>

            <div className="flex justify-between text-sm pt-2 text-slate-400 border-t">
              <span>Регистрация:</span>
              <span>{formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
            <Users className="w-4 h-4 text-purple-500" /> Сообщество
          </h2>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col p-2 bg-slate-50 rounded-lg">
              <span className="text-xl font-bold text-slate-900">
                {profile.followersCount}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Подписчики
              </span>
            </div>
            <div className="flex flex-col p-2 bg-slate-50 rounded-lg">
              <span className="text-xl font-bold text-slate-900">
                {profile.followedCount}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Подписки
              </span>
            </div>
            <div className="flex flex-col p-2 bg-slate-50 rounded-lg">
              <span className="text-xl font-bold text-slate-900">
                {profile.postsCount}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Посты
              </span>
            </div>
          </div>
        </div>

        {/* Биография (на всю ширину) */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm md:col-span-2">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 border-b pb-2 mb-3">
            <FileText className="w-4 h-4 text-emerald-500" /> О себе
          </h2>
          <p className="text-slate-600 leading-relaxed italic">
            {profile.bio || "Информация отсутствует..."}
          </p>
        </div>
      </div>

      {/* Само модальное окно */}
      <EditProfileModal profile={profile} />
    </div>
  );
}
