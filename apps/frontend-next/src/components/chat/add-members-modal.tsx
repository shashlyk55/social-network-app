"use client";

import { useMe } from "@/hooks/profile/use-me";
import { FollowDirection, ProfilePreview } from "@/types/profile";
import { Loader2, X } from "lucide-react";
import { useFollows } from "@/hooks/follow/use-follows";
import { useSelectMembersStore } from "@/store/use-select-chat-participants-store";
import { MemberSelectItem } from "./member-select-item";
import { useChatParticipants } from "@/hooks/chat-participants/use-chat-participants";
import { useModalStore } from "@/store/use-modal-store";
import { useAddParticipants } from "@/hooks/chat-participants/use-add-participant";

export const AddMembersModal = () => {
  const { data: me } = useMe();
  const { selectedIds, toggleMember, reset } = useSelectMembersStore();

  const { data, type, isOpen, onClose } = useModalStore();
  const isModalOpen = isOpen && type === "addMembers";
  const chatId = data.chatId;

  const { data: participantsData } = useChatParticipants(chatId!);
  const { mutate: addParticipants, isPending } = useAddParticipants(chatId!);

  const { data: followers, isLoading: loadingFollowers } = useFollows(
    FollowDirection.FOLLOWERS,
    me?.id
  );
  const { data: following, isLoading: loadingFollowing } = useFollows(
    FollowDirection.FOLLOWING,
    me?.id
  );

  const handleConfirm = () => {
    if (selectedIds.length === 0) return;

    addParticipants(selectedIds, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const existingMemberIds = new Set(
    participantsData?.data.map((p) => p.profile.id) || []
  );

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative p-6 bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Add Members</h2>

        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Following
            </h3>
            {loadingFollowing ? (
              <Loader2 className="animate-spin" />
            ) : (
              following?.data.map((user: ProfilePreview) => (
                <MemberSelectItem
                  key={user.id}
                  user={user}
                  isSelected={selectedIds.includes(user.id)}
                  onToggle={() => toggleMember(user.id)}
                  isAlreadyMember={existingMemberIds.has(user.id)}
                />
              ))
            )}
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Followers
            </h3>
            {loadingFollowers ? (
              <Loader2 className="animate-spin" />
            ) : (
              followers?.data.map((user: ProfilePreview) => (
                <MemberSelectItem
                  key={user.id}
                  user={user}
                  isSelected={selectedIds.includes(user.id)}
                  onToggle={() => toggleMember(user.id)}
                  isAlreadyMember={existingMemberIds.has(user.id)}
                />
              ))
            )}
          </section>
        </div>

        <button
          onClick={handleConfirm}
          disabled={selectedIds.length === 0 || isPending}
          className="w-full mt-6 py-3 bg-[#00b4ff] text-black rounded-xl font-bold disabled:opacity-50 transition"
        >
          {isPending ? "Adding..." : `Add ${selectedIds.length} Members`}
        </button>
      </div>
    </div>
  );
};
