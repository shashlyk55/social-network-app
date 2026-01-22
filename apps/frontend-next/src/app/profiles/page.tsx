"use client";

import { UserAvatar } from "@/components/ui/user-avatar";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useProfilesSearch } from "@/hooks/profile/use-profiles-search";
import { ProfilePreview } from "@/types/profile";

export default function ProfilesSearchPage() {
  const {
    searchTerm,
    setSearchTerm,
    data: profiles,
    isLoading,
  } = useProfilesSearch();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Поиск людей</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введите имя или username..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-blue-950"
          />
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : (
          profiles?.map((profile: ProfilePreview) => (
            <Link
              key={profile.id}
              href={`/profiles/${profile.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
            >
              <UserAvatar
                src={profile.avatarUrl}
                displayName={profile.displayName}
                className="h-12 w-12"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">
                  {profile.displayName}
                </span>
                <span className="text-sm text-slate-500">
                  @{profile.username}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
