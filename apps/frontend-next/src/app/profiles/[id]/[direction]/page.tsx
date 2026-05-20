"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useFollows } from "@/hooks/follow/use-follows";
import { ProfileListItem } from "@/components/profile/profile-list-item";
import { Loader2, Lock } from "lucide-react";
import { FollowDirection } from "@/types/profile";

export default function UserFollowsPage() {
  const params = useParams();
  const [page, setPage] = useState(1);

  const targetId = Number(params.id);
  const direction = params.direction as FollowDirection;

  const { data, isLoading, error } = useFollows(direction, targetId, page);

  const title = direction === "followers" ? "Подписчики" : "Подписки";

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // Обработка ошибки доступа (например, приватный профиль)
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold">Это приватный аккаунт</h2>
        <p className="text-slate-500">
          Подпишитесь на пользователя, чтобы увидеть список его{" "}
          {title.toLowerCase()}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </header>

      <div className="space-y-3">
        {data?.data.length === 0 ? (
          <p className="text-center py-10 text-slate-500 italic">Список пуст</p>
        ) : (
          data?.data.map((profile) => (
            <ProfileListItem
              key={profile.id}
              profile={profile}
              showFollowBtn={false}
            />
          ))
        )}
      </div>

      {/* Пагинация */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50"
          >
            Назад
          </button>
          <span className="text-sm font-medium">
            {page} / {data.meta.totalPages}
          </span>
          <button
            disabled={page === data.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
}
