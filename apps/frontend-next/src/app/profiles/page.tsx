"use client";

import { Search as SearchIcon, Loader2 } from "lucide-react";
import { useProfilesSearch } from "@/hooks/profile/use-profiles-search";
import { ProfilePreview } from "@/types/profile";
import { ProfileListItem } from "@/components/profile/profile-list-item";

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
            <ProfileListItem key={profile.id} profile={profile} />
          ))
        )}
      </div>
    </div>
  );
}
