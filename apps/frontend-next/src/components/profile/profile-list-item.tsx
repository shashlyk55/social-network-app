"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ProfilePreview } from "@/types/profile";
import { cn } from "@/lib/utils/cn";
import { useToggleFollow } from "@/hooks/follow/use-toggle-follow";
import { Loader2 } from "lucide-react";
import { useMe } from "@/hooks/profile/use-me";

interface ProfileCardProps {
  profile: ProfilePreview;
  showFollowBtn?: boolean;
}

export const ProfileListItem = ({
  profile,
  showFollowBtn = true,
}: ProfileCardProps) => {
  const { data: me } = useMe();
  const isItMe = me?.id === profile.id;

  const { mutate: toggleFollow, isPending } = useToggleFollow(
    profile.id,
    profile.isFollowed ?? false
  );

  const profileHref = isItMe ? "/profiles/me" : `/profiles/${profile.id}`;

  const canShowFollowButton =
    profile.isFollowed !== undefined && showFollowBtn && !isItMe;

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-sm transition-all group">
      <Link href={profileHref} className="flex items-center gap-4 flex-1">
        <UserAvatar
          src={profile.avatarUrl}
          displayName={profile.displayName}
          className="h-12 w-12 border-2 border-slate-50 group-hover:border-blue-50 transition-colors"
        />
        <div className="flex flex-col overflow-hidden text-left">
          <span className="truncate font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {profile.displayName}
          </span>
          <span className="truncate text-sm text-slate-500">
            @{profile.username}
          </span>
        </div>
      </Link>

      {canShowFollowButton && (
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFollow();
          }}
          disabled={isPending}
          className={cn(
            "px-5 py-2 rounded-xl text-sm font-semibold transition-all min-w-[120px] flex justify-center items-center",
            profile.isFollowed
              ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
          )}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : profile.isFollowed ? (
            "Подписан"
          ) : (
            "Подписаться"
          )}
        </button>
      )}
    </div>
  );
};
