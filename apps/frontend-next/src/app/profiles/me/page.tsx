"use client";

import { PostItem } from "@/components/post/post-item";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useProfilePosts } from "@/hooks/post/use-profile-posts";
import { useMe } from "@/hooks/profile/use-me";
import { useModalStore } from "@/store/use-modal-store";
import { Settings, Edit2, Rocket, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MyProfilePage() {
  const { data: profile, isLoading: isProfileLoading } = useMe();
  const { onOpen } = useModalStore();
  const [activeTab, setActiveTab] = useState("posts");

  const { data: postsData, isLoading: isPostsLoading } = useProfilePosts({
    authorProfileId: profile?.id as number,
    isArchived: activeTab === "archive",
  });

  if (isProfileLoading)
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  if (!profile)
    return (
      <div className="p-8 text-center text-slate-400">Вы не авторизованы</div>
    );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Верхняя часть: Аватар и Кнопки */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="relative group">
            <UserAvatar
              src={profile.avatarUrl}
              displayName={profile.displayName}
              className="h-32 w-32 md:h-40 md:w-40 text-5xl border-4 border-[#1a1a1a] shadow-2xl transition-transform group-hover:scale-105"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Кнопка редактирования профиля */}
            <button
              onClick={() => onOpen("editProfile")}
              className="flex items-center gap-2 px-5 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded-xl text-sm font-semibold transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>

            {/* Кнопка создания поста */}
            <button
              onClick={() => onOpen("createPost")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              <Plus className="w-5 h-5" />
              <span>Создать пост</span>
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

          {profile.bio === undefined && (
            <p className="max-w-2xl text-slate-300 leading-relaxed text-lg">
              {profile.bio}
              <Rocket className="inline-block w-5 h-5 ml-2 text-pink-500" />
            </p>
          )}

          {/* Статистика */}
          <div className="flex gap-8 pt-4">
            <Link
              href="/profiles/me/followers"
              className="flex items-baseline gap-1.5 group"
            >
              <span className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                {profile.followersCount.toLocaleString()}
              </span>
              <span className="text-slate-500 font-medium">Followers</span>
            </Link>
            <Link
              href="/profiles/me/following"
              className="flex items-baseline gap-1.5 group"
            >
              <span className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                {profile.followedCount.toLocaleString()}
              </span>
              <span className="text-slate-500 font-medium">Following</span>
            </Link>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold">{profile.postsCount}</span>
              <span className="text-slate-500 font-medium">Posts</span>
            </div>
          </div>
        </div>

        {/* Табы (Навигация по контенту) */}
        <div className="border-b border-[#222] mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === "posts"
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              My Posts
              {activeTab === "posts" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === "archive"
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Archive
              {activeTab === "archive" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {/* Секция контента (Посты) */}
        <div className="space-y-6">
          {isPostsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {" "}
              {/* popLayout предотвращает "прыжки" списка */}
              {postsData?.data?.length ? (
                postsData.data.map((post) => (
                  <motion.div
                    key={post.id}
                    layout // Автоматически сдвигает соседние элементы вверх
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <PostItem
                      post={post}
                      isArchivePage={activeTab === "archive"}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 border border-dashed border-[#222] rounded-3xl"
                >
                  <p className="text-slate-500">
                    {activeTab === "posts"
                      ? "You haven't posted anything yet"
                      : "Your archive is empty"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
