"use client";

import { useParams } from "next/navigation";
import { useProfileById } from "@/hooks/profile/use-profile-by-id";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Lock,
  FileText,
  Loader2,
  UserCheck,
  Clock,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useToggleFollow } from "@/hooks/follow/use-toggle-follow";
import { cn } from "@/lib/utils/cn";

export default function OtherProfilePage() {
  const { id } = useParams();
  const profileId = Number(id);

  const { data: profile, isLoading } = useProfileById(profileId);
  const { mutate: toggleFollow, isPending: isFollowPending } = useToggleFollow(
    profileId, // Приводим к строке для API, если нужно
    profile?.isFollowed || false
  );

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  if (!profile)
    return (
      <div className="p-8 text-center text-red-500">Профиль не найден</div>
    );

  const getButtonConfig = () => {
    if (!profile.isFollowed) {
      return {
        text: "Подписаться",
        variant: "primary",
        icon: <UserPlus className="w-4 h-4" />,
      };
    }
    if (profile.isFollowed && !profile.isFollowAccepted) {
      return {
        text: "Запрос отправлен",
        variant: "secondary",
        icon: <Clock className="w-4 h-4" />,
      };
    }
    return {
      text: "Подписан",
      variant: "success",
      icon: <UserCheck className="w-4 h-4" />,
    };
  };

  const config = getButtonConfig();

  const isPendingFollow = profile.isFollowed && !profile.isFollowAccepted;
  const isFullyFollowed = profile.isFollowed && profile.isFollowAccepted;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Шапка профиля */}
      <div className="flex flex-col items-center sm:flex-row sm:items-end gap-6 mb-8">
        <UserAvatar
          src={profile.avatarUrl}
          displayName={profile.displayName}
          className="h-32 w-32 text-4xl shadow-md"
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-3xl font-bold text-slate-900">
              {profile.displayName}
            </h1>
            {!profile.isPublic && <Lock className="w-5 h-5 text-slate-400" />}
          </div>
          <p className="text-slate-500 text-lg">@{profile.username}</p>

          {/* Кнопка подписки (заглушка) */}
          <button
            disabled={isFollowPending}
            onClick={() => toggleFollow()}
            className={cn(
              "mt-4 px-6 py-2 rounded-full font-medium transition-all active:scale-95 disabled:opacity-70",
              // Синяя если не подписан, серая если запрос отправлен или уже подписан
              !profile.isFollowed
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                : "bg-slate-200 text-slate-700"
            )}
          >
            {isFollowPending ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <>
                {!profile.isFollowed && "Подписаться"}
                {isPendingFollow && "Запрос отправлен"}
                {isFullyFollowed && "Отписаться"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Статистика (всегда видна) */}
      <div className="bg-white border border-slate-200 p-1 rounded-2xl mb-6">
        <div className="grid grid-cols-3 divide-x divide-slate-100 py-3 text-center">
          <div>
            <div className="text-xl font-bold text-slate-900">
              {profile.followersCount}
            </div>
            <div className="text-xs text-slate-500 uppercase">Подписчики</div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {profile.followedCount}
            </div>
            <div className="text-xs text-slate-500 uppercase">Подписки</div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {profile.publicPostsCount}
            </div>
            <div className="text-xs text-slate-500 uppercase">Посты</div>
          </div>
        </div>
      </div>

      {/* Контент в зависимости от прав доступа */}
      <div className="space-y-6">
        {profile.canViewFullProfile ? (
          <>
            {/* Блок "О себе" */}
            {profile.bio && (
              <div className="bg-slate-50 p-5 rounded-xl">
                <h2 className="text-sm font-semibold text-slate-500 uppercase mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Биография
                </h2>
                <p className="text-slate-700">{profile.bio}</p>
              </div>
            )}
          </>
        ) : (
          /* Заглушка приватности */
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Это закрытый аккаунт
            </h3>
            <p className="text-slate-500 max-w-[250px] mt-2">
              Подпишитесь на @{profile.username}, чтобы видеть их публикации и
              личные данные.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
