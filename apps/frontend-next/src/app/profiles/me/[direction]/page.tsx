"use client";

import { useState } from "react";
import { useMe } from "@/hooks/profile/use-me";
import { useFollows } from "@/hooks/follow/use-follows";
import { ProfileListItem } from "@/components/profile/profile-list-item";
import { Loader2 } from "lucide-react";
import { FollowDirection } from "@/types/profile";
import { useParams } from "next/navigation";

export default function MyFollowersPage() {
  const params = useParams();
  const [page, setPage] = useState(1);
  const { data: me, isLoading: isMeLoading } = useMe();
  const direction = params.direction as FollowDirection;

  const { data: followersData, isLoading: isFollowsLoading } = useFollows(
    direction,
    me?.id,
    page
  );

  const title = direction === "followers" ? "Подписчики" : "Подписки";

  const isLoading = isMeLoading || isFollowsLoading;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </header>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : followersData?.data.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-2xl">
            У вас пока нет подписчиков
          </div>
        ) : (
          followersData?.data.map((profile) => (
            <ProfileListItem
              key={profile.id}
              profile={profile}
              showFollowBtn={false}
            />
          ))
        )}
      </div>

      {/* Пагинация (простая реализация) */}
      {followersData?.meta && followersData.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded-xl disabled:opacity-50 hover:bg-slate-50"
          >
            Назад
          </button>
          <div className="flex items-center px-4 text-sm font-medium">
            {page} / {followersData.meta.totalPages}
          </div>
          <button
            disabled={page === followersData.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-xl disabled:opacity-50 hover:bg-slate-50"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
}
