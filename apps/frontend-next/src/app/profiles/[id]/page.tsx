"use client";

import { useParams } from "next/navigation";
import { useProfileById } from "@/hooks/profile/use-profile-by-id";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Lock,
  Loader2,
  Clock,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import { useToggleFollow } from "@/hooks/follow/use-toggle-follow";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export default function OtherProfilePage() {
  const { id } = useParams();
  const profileId = Number(id);

  const { data: profile, isLoading } = useProfileById(profileId);
  const { mutate: toggleFollow, isPending: isFollowPending } = useToggleFollow(
    profileId,
    profile?.isFollowed || false
  );

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-red-500 font-medium">
        Профиль не найден
      </div>
    );

  const isPendingFollow = profile.isFollowed && !profile.isFollowAccepted;
  const isFullyFollowed = profile.isFollowed && profile.isFollowAccepted;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Шапка: Аватар и кнопки действий */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="relative">
            <UserAvatar
              src={profile.avatarUrl}
              displayName={profile.displayName}
              className="h-32 w-32 md:h-40 md:w-40 text-5xl border-4 border-[#1a1a1a] shadow-2xl"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Динамическая кнопка подписки */}
            <button
              disabled={isFollowPending}
              onClick={() => toggleFollow()}
              className={cn(
                "flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 text-sm",
                !profile.isFollowed
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                  : "bg-[#1a1a1a] border border-[#333] text-slate-300 hover:bg-[#252525]"
              )}
            >
              {isFollowPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {!profile.isFollowed && "Follow"}
                  {isPendingFollow && (
                    <>
                      <Clock className="w-4 h-4" />
                      Requested
                    </>
                  )}
                  {isFullyFollowed && "Unfollow"}
                </>
              )}
            </button>

            {/* Кнопка сообщения (видна всем) */}
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-xl hover:bg-[#252525] transition-all text-sm font-bold text-slate-200">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>

            <button className="p-2.5 bg-[#1a1a1a] border border-[#333] rounded-xl hover:bg-[#252525] transition-all">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Инфо о пользователе */}
        <div className="space-y-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {profile.displayName}
            </h1>
            <p className="text-xl text-slate-500">@{profile.username}</p>
          </div>

          <p className="max-w-2xl text-slate-300 leading-relaxed text-lg">
            {profile.bio ||
              "Full-stack developer & writer. Passionate about web technologies, design systems, and creating beautiful user experiences. Building in public 🚀"}
          </p>

          {/* Статистика */}
          <div className="flex gap-8 pt-4">
            <Link
              href={`/profiles/${id}/followers`}
              className="flex items-baseline gap-1.5 group"
            >
              <span className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                {profile.followersCount.toLocaleString()}
              </span>
              <span className="text-slate-500 font-medium">Followers</span>
            </Link>
            <Link
              href={`/profiles/${id}/following`}
              className="flex items-baseline gap-1.5 group"
            >
              <span className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                {profile.followedCount.toLocaleString()}
              </span>
              <span className="text-slate-500 font-medium">Following</span>
            </Link>
            {profile.publicPostsCount !== undefined && (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold">
                  {profile.publicPostsCount}
                </span>
                <span className="text-slate-500 font-medium">Posts</span>
              </div>
            )}
          </div>
        </div>

        {/* Табы контента */}
        <div className="border-b border-[#222] mb-8">
          <div className="flex gap-8">
            <button className="pb-4 text-sm font-bold text-white relative">
              Posts
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />
            </button>
          </div>
        </div>

        {/* Контентная область */}
        <div className="space-y-6">
          {profile.canViewFullProfile ? (
            <div className="space-y-6"></div>
          ) : (
            /* Дизайн приватного профиля (Замок) */
            <div className="flex flex-col items-center justify-center py-24 px-6 border border-[#222] bg-[#111] rounded-3xl text-center">
              <div className="bg-[#1a1a1a] p-6 rounded-full border border-[#333] mb-6">
                <Lock className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                This account is private
              </h3>
              <p className="text-slate-500 max-w-[320px] text-lg">
                Follow this account to see their posts and activity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
